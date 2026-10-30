import { HttpClient } from "@angular/common/http";
import { Injectable, PLATFORM_ID, Signal, inject, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";
import {
	Album,
	AlbumDetail,
	AlbumPhoto,
	JournalItem,
	ProgramEvent,
	PublicBoardMember,
	PublicGroup,
	PublicReport,
} from "./schema";
import { HydrationState } from "./hydration-state";

export interface LiveData<T> {
	value: Signal<T | undefined>;
	error: Signal<unknown>;
	loading: Signal<boolean>;
}

type Params = Record<string, string | number | boolean>;

@Injectable({ providedIn: "root" })
export class ApiService {
	private readonly http = inject(HttpClient);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
	private readonly hydration = inject(HydrationState);

	readonly root = `${environment.apiRoot}/public/v2`;
	private journalRequest?: Promise<JournalItem[]>;

	url(path: string): string {
		return this.root + path;
	}

	live<T>(path: string, params?: Params): LiveData<T> {
		const value = signal<T | undefined>(undefined);
		const error = signal<unknown>(undefined);
		const loading = signal(true);
		const url = this.url(path);
		const refresh = this.browser && !this.hydration.done;

		this.http.get<T>(url, { params }).subscribe({
			next: (data) => {
				value.set(data);
				loading.set(false);
				if (refresh) {
					this.http
						.get<T>(url, { params, transferCache: false })
						.subscribe({ next: (fresh) => value.set(fresh), error: () => undefined });
				}
			},
			error: (err) => {
				error.set(err);
				loading.set(false);
			},
		});

		return { value: value.asReadonly(), error: error.asReadonly(), loading: loading.asReadonly() };
	}

	program(): LiveData<ProgramEvent[]> {
		return this.live<ProgramEvent[]>("/program");
	}

	journal(): LiveData<JournalItem[]> {
		return this.live<JournalItem[]>("/journal");
	}

	latestJournal(): LiveData<JournalItem[]> {
		return this.live<JournalItem[]>("/journal", { sort: "publishedAt", limit: 1 });
	}

	recentAlbums(limit: number): LiveData<Album[]> {
		return this.live<Album[]>("/albums/recent", { limit });
	}

	album(id: string | number): LiveData<AlbumDetail> {
		return this.live<AlbumDetail>(`/albums/${encodeURIComponent(id)}`);
	}

	albumPhotos(id: string | number): LiveData<AlbumPhoto[]> {
		return this.live<AlbumPhoto[]>(`/albums/${encodeURIComponent(id)}/photos`);
	}

	groups(): LiveData<PublicGroup[]> {
		return this.live<PublicGroup[]>("/groups");
	}

	boardMembers(): LiveData<PublicBoardMember[]> {
		return this.live<PublicBoardMember[]>("/board-members");
	}

	report(id: string | number): LiveData<PublicReport> {
		return this.live<PublicReport>(`/reports/${encodeURIComponent(id)}`);
	}

	icalUrl(): string {
		return this.url("/program/ical");
	}

	async fetchGalleryAlbumIds(): Promise<string[]> {
		return (await this.fetchJournal()).flatMap((item) =>
			item.albumId && !item.reportId ? [String(item.albumId)] : [],
		);
	}

	async fetchReportIds(): Promise<string[]> {
		return (await this.fetchJournal()).flatMap((item) => (item.reportId ? [String(item.reportId)] : []));
	}

	private fetchJournal(): Promise<JournalItem[]> {
		this.journalRequest ??= firstValueFrom(
			this.http.get<JournalItem[]>(this.url("/journal"), { transferCache: false }),
		);
		return this.journalRequest;
	}
}
