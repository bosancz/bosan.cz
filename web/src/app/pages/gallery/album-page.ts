import { isPlatformBrowser } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	OnInit,
	PLATFORM_ID,
	signal,
	input,
	untracked,
} from "@angular/core";
import { ApiService, LiveData } from "../../core/api.service";
import { AccountService } from "../../core/account.service";
import { groupInfo, sortGroupIds } from "../../core/groups";
import { AlbumDetail, AlbumPhoto } from "../../core/schema";
import { OG_IMAGE_SIZE, SeoService } from "../../core/seo.service";
import { albumDatesWithYear, albumName } from "./gallery-dates";
import { EventDetail } from "./event-detail";
import { eventWater } from "./event-format";
import { PhotoViewer } from "./photo-viewer";
import { markdownToText } from "../../core/markdown";

const albumCache = new Map<string, { album: AlbumDetail; photos: AlbumPhoto[] }>();

@Component({
	selector: "bo-album-page",
	imports: [EventDetail, PhotoViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./album-page.html",
})
export class AlbumPage implements OnInit {
	readonly album = input.required<string>();
	readonly photo = input<string>();

	protected readonly account = inject(AccountService);
	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly source = signal<LiveData<AlbumDetail> | undefined>(undefined);
	private readonly photosSource = signal<LiveData<AlbumPhoto[]> | undefined>(undefined);
	private readonly cached = computed(() => (this.browser ? albumCache.get(this.album()) : undefined));

	protected readonly data = computed<AlbumDetail | undefined>(() => this.source()?.value() ?? this.cached()?.album);
	protected readonly failed = computed(() => !this.data() && !!this.source()?.error());
	protected readonly photos = computed<AlbumPhoto[]>(
		() => this.photosSource()?.value() ?? this.cached()?.photos ?? [],
	);
	protected readonly photosLoaded = computed(() => !!this.photosSource()?.value() || !!this.cached());
	protected readonly name = computed(() => albumName(this.data()?.name ?? ""));
	protected readonly dates = computed(() => {
		const album = this.data();
		return album ? albumDatesWithYear(album.dateFrom, album.dateTill) : "";
	});
	protected readonly downloadHref = computed(() => this.data()?.downloadUrl);
	protected readonly water = computed(() => {
		const event = this.data()?.event;
		return event ? eventWater(event) : "";
	});
	protected readonly groups = computed(() => sortGroupIds(this.data()?.event?.groups ?? []).map(groupInfo));
	protected readonly leaders = computed(() =>
		(this.data()?.event?.leaders ?? []).map((leader) => leader.nickname).join(", "),
	);

	ngOnInit(): void {
		if (this.cached()) return;
		this.source.set(this.api.album(this.album()));
		this.photosSource.set(this.api.albumPhotos(this.album()));
	}

	constructor() {
		effect(() => {
			const album = this.source()?.value();
			const photos = this.photosSource()?.value();
			if (album && photos && this.browser) albumCache.set(String(album.id), { album, photos });
		});

		effect(() => {
			const album = this.data();
			const photos = this.photos();
			const failed = this.failed();
			untracked(() => {
				if (album) this.setSeo(album, photos);
				else if (failed) {
					this.seo.set({
						title: "Album nenalezeno",
						description: "Požadované album se v fotogalerii dětské vodácké skupiny ŠÁN nepodařilo najít.",
						path: `/jak-jsme-se-meli/album/${this.album()}`,
						noindex: true,
					});
				}
			});
		});
	}

	private setSeo(album: AlbumDetail, photos: AlbumPhoto[]): void {
		const name = albumName(album.name);
		const dates = albumDatesWithYear(album.dateFrom, album.dateTill);
		const title = photos.length ? `${name} (${album.dateFrom.slice(0, 4)})` : name;
		const text = markdownToText(album.description) || `Fotky z akce ${name} dětské vodácké skupiny ŠÁN, ${dates}.`;
		const description =
			text.length <= 160
				? text
				: text
						.slice(0, 160)
						.replace(/\s+\S*$/, "")
						.replace(/[,.;:–-]+$/, "") + "…";
		const path = `/jak-jsme-se-meli/album/${album.id}`;
		this.seo.set({
			title,
			description,
			path,
			image: `/og/album-${album.id}.jpg`,
			imageSize: OG_IMAGE_SIZE,
			imageAlt: name,
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "ImageGallery",
				name,
				description: markdownToText(album.description) || description,
				url: this.seo.absoluteUrl(path),
				datePublished: album.publishedAt ?? undefined,
				dateCreated: album.dateFrom,
				image: photos.slice(0, 12).map((p) => ({
					"@type": "ImageObject",
					contentUrl: p.urls.big,
					thumbnailUrl: p.urls.small,
					caption: p.caption || undefined,
				})),
				isPartOf: {
					"@type": "CollectionPage",
					name: "Fotogalerie – ŠÁN",
					url: this.seo.absoluteUrl("/jak-jsme-se-meli"),
				},
			},
		});
	}
}
