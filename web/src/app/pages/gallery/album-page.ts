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
import { Router } from "@angular/router";
import { ApiService, LiveData } from "../../core/api.service";
import { Album, Photo } from "../../core/schema";
import { OG_IMAGE_SIZE, SeoService } from "../../core/seo.service";
import { albumDates, albumName } from "./gallery-dates";
import { EventDetail } from "./event-detail";
import { PhotoViewer } from "./photo-viewer";
import { markdownToText } from "../../core/markdown";

const albumCache = new Map<string, Album>();

@Component({
	selector: "bo-album-page",
	imports: [EventDetail, PhotoViewer],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./album-page.html",
})
export class AlbumPage implements OnInit {
	readonly album = input.required<string>();
	readonly photo = input<string>();

	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly router = inject(Router);
	private readonly reports = this.browser ? this.api.reports() : undefined;
	private readonly source = signal<LiveData<Album> | undefined>(undefined);

	protected readonly data = computed<Album | undefined>(() => {
		const id = this.album();
		return this.source()?.value() ?? (this.browser ? albumCache.get(id) : undefined);
	});
	protected readonly failed = computed(() => !this.data() && !!this.source()?.error());
	protected readonly photos = computed<Photo[]>(() => (this.data()?.photos ?? []).filter((p) => p.sizes?.small));
	protected readonly name = computed(() => albumName(this.data()?.name ?? ""));
	protected readonly dates = computed(() => {
		const album = this.data();
		return album ? `${albumDates(album.dateFrom, album.dateTill)} ${album.dateFrom.slice(0, 4)}` : "";
	});
	protected readonly downloadHref = computed(() => this.data()?._links?.download?.href);

	ngOnInit(): void {
		if (!(this.browser && albumCache.has(this.album()))) this.source.set(this.api.album(this.album()));
	}

	constructor() {
		effect(() => {
			const report = this.reports?.value()?.find((r) => r.album?._id === this.album());
			if (report && !this.photo())
				void this.router.navigate(["/jak-jsme-se-meli", report._id], { replaceUrl: true });
		});

		effect(() => {
			const album = this.data();
			if (album && this.browser) albumCache.set(album._id, album);
		});

		effect(() => {
			const album = this.data();
			const failed = this.failed();
			untracked(() => {
				if (album) this.setSeo(album);
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

	private setSeo(album: Album): void {
		const name = albumName(album.name);
		const dates = albumDates(album.dateFrom, album.dateTill);
		const photos = (album.photos ?? []).filter((p) => p.sizes?.big);
		const title = photos.length ? `${name} (${album.dateFrom.slice(0, 4)})` : name;
		const text =
			markdownToText(album.description) ||
			`Fotky z akce ${name} dětské vodácké skupiny ŠÁN, ${dates} ${album.dateFrom.slice(0, 4)}.`;
		const description =
			text.length <= 160
				? text
				: text
						.slice(0, 160)
						.replace(/\s+\S*$/, "")
						.replace(/[,.;:–-]+$/, "") + "…";
		const path = `/jak-jsme-se-meli/album/${album._id}`;
		this.seo.set({
			title,
			description,
			path,
			image: `/og/album-${album._id}.jpg`,
			imageSize: OG_IMAGE_SIZE,
			imageAlt: name,
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "ImageGallery",
				name,
				description: markdownToText(album.description) || description,
				url: this.seo.absoluteUrl(path),
				datePublished: album.datePublished ?? undefined,
				dateCreated: album.dateFrom,
				image: photos.slice(0, 12).map((p) => ({
					"@type": "ImageObject",
					contentUrl: p.sizes.big!.url,
					thumbnailUrl: p.sizes.small?.url,
					caption: p.caption || undefined,
				})),
				isPartOf: {
					"@type": "CollectionPage",
					name: "Jak jsme se měli – ŠÁN",
					url: this.seo.absoluteUrl("/jak-jsme-se-meli"),
				},
			},
		});
	}
}
