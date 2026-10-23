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
import { RouterLink } from "@angular/router";
import { ApiService, LiveData } from "../../core/api.service";
import { Album, Photo } from "../../core/schema";
import { OG_IMAGE_SIZE, SeoService } from "../../core/seo.service";
import { albumDates, albumName } from "./gallery-dates";
import { PhotoViewer } from "./photo-viewer";
import { MarkdownPipe, markdownToText } from "../../core/markdown";

const albumCache = new Map<string, Album>();

export function photoCount(count: number): string {
	if (count === 1) return "1 fotografie";
	if (count >= 2 && count <= 4) return `${count} fotografie`;
	return `${count} fotografií`;
}

@Component({
	selector: "bo-album-page",
	imports: [RouterLink, PhotoViewer, MarkdownPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./album-page.html",
	styleUrl: "./album-page.scss",
})
export class AlbumPage implements OnInit {
	readonly album = input.required<string>();
	readonly photo = input<string>();

	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

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
		return album ? albumDates(album.dateFrom, album.dateTill) : "";
	});
	protected readonly year = computed(() => this.data()?.dateFrom?.slice(0, 4) ?? "");
	protected readonly countLabel = computed(() => photoCount(this.photos().length));
	protected readonly downloadHref = computed(() => this.data()?._links?.download?.href);

	ngOnInit(): void {
		if (!(this.browser && albumCache.has(this.album()))) this.source.set(this.api.album(this.album()));
	}

	constructor() {
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
						path: `/fotogalerie/${this.album()}`,
						noindex: true,
					});
				}
			});
		});
	}

	protected ratio(photo: Photo): number {
		const size = photo.sizes.small!;
		return size.width / size.height;
	}

	private setSeo(album: Album): void {
		const name = albumName(album.name);
		const dates = albumDates(album.dateFrom, album.dateTill);
		const photos = (album.photos ?? []).filter((p) => p.sizes?.big);
		const title = photos.length ? `${name} (${album.dateFrom.slice(0, 4)})` : name;
		const lead = markdownToText(album.description) || `Fotoalbum ${name} z akce dětské vodácké skupiny ŠÁN.`;
		const description =
			`${lead} ${dates} ${album.dateFrom.slice(0, 4)}, ${photoCount(photos.length)} v galerii ŠÁN.`
				.replace(/\s+/g, " ")
				.slice(0, 160);
		const path = `/fotogalerie/${album._id}`;
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
					name: "Fotogalerie ŠÁN",
					url: this.seo.absoluteUrl("/fotogalerie"),
				},
			},
		});
	}
}
