import { HttpClient } from "@angular/common/http";
import { Injectable, PLATFORM_ID, Signal, inject, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";
import { Album, ProgramEvent, PublicBoardMember, PublicGroup, PublicReport } from "./schema";

export const REPORTS_PAGE = 100;
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

	readonly root = environment.apiRoot;

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
		return this.live<ProgramEvent[]>("/public/program");
	}

	gallery(): LiveData<Album[]> {
		return this.live<Album[]>("/public/gallery", { sort: "-dateFrom" });
	}

	recentAlbums(limit: number): LiveData<Album[]> {
		return this.live<Album[]>("/public/gallery/recent", { limit });
	}

	album(id: string): LiveData<Album> {
		return this.live<Album>(`/public/gallery/${encodeURIComponent(id)}`);
	}

	albumPreview(id: string): LiveData<Album> {
		return this.live<Album>(`/public/gallery/${encodeURIComponent(id)}/preview`);
	}

	groups(): LiveData<PublicGroup[]> {
		return this.live<PublicGroup[]>("/public/groups");
	}

	boardMembers(): LiveData<PublicBoardMember[]> {
		return this.live<PublicBoardMember[]>("/public/board-members");
	}

	reports(): LiveData<PublicReport[]> {
		return this.live<PublicReport[]>("/public/reports", { limit: REPORTS_PAGE });
	}

	fetchReports(offset: number): Promise<PublicReport[]> {
		return firstValueFrom(
			this.http.get<PublicReport[]>(this.url("/public/reports"), {
				params: { limit: REPORTS_PAGE, offset },
				transferCache: false,
			}),
		);
	}

	recentReports(limit: number): LiveData<PublicReport[]> {
		return this.live<PublicReport[]>("/public/reports", { limit });
	}

	report(id: string): LiveData<PublicReport> {
		return this.live<PublicReport>(`/public/reports/${encodeURIComponent(id)}`);
	}

	icalUrl(): string {
		return this.url("/public/program/ical");
	}

	async fetchGalleryAlbumIds(): Promise<string[]> {
		const albums = await firstValueFrom(this.http.get<Album[]>(this.url("/public/gallery")));
		return albums.map((album) => album._id);
	}

	async fetchReportIds(): Promise<string[]> {
		const ids: string[] = [];
		try {
			for (let offset = 0; ; offset += REPORTS_PAGE) {
				const page = await this.fetchReports(offset);
				ids.push(...page.map((report) => report._id));
				if (page.length < REPORTS_PAGE) return ids;
			}
		} catch {
			return ids;
		}
	}
}
