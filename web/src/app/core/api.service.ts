import { HttpClient } from "@angular/common/http";
import { Injectable, PLATFORM_ID, Signal, inject, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { environment } from "../../environments/environment";
import {
	Album,
	AlbumDetail,
	AlbumPhoto,
	GalleryStats,
	GalleryItem,
	ProgramEvent,
	PublicBoardMember,
	PublicGroup,
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
	private galleryRequest?: Promise<GalleryItem[]>;

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

	gallery(): LiveData<GalleryItem[]> {
		return this.live<GalleryItem[]>("/gallery");
	}

	latestAlbum(): LiveData<GalleryItem[]> {
		return this.live<GalleryItem[]>("/gallery", { sort: "publishedAt", limit: 1 });
	}

	galleryStats(): LiveData<GalleryStats> {
		return this.live<GalleryStats>("/gallery/stats");
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

	icalUrl(): string {
		return this.url("/program/ical");
	}

	async fetchGalleryAlbumIds(): Promise<string[]> {
		return (await this.fetchGallery()).map((item) => String(item.albumId));
	}

	private fetchGallery(): Promise<GalleryItem[]> {
		this.galleryRequest ??= firstValueFrom(
			this.http.get<GalleryItem[]>(this.url("/gallery"), { transferCache: false }),
		);
		return this.galleryRequest;
	}
}
