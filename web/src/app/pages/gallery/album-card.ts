import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Injector,
	afterNextRender,
	computed,
	inject,
	input,
	signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiService, LiveData } from "../../core/api.service";
import { Album } from "../../core/schema";
import { albumDates, albumName } from "./gallery-dates";
import { TypographyPipe } from "../../core/typography";

@Component({
	selector: "bo-album-card",
	imports: [RouterLink, TypographyPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./album-card.html",
	styleUrl: "./album-card.scss",
})
export class AlbumCard {
	readonly album = input.required<Album>();
	readonly reportId = input<string | null>(null);
	readonly preview = input(true);
	readonly badges = input<string[]>([]);
	readonly eager = input(false);

	private readonly api = inject(ApiService);
	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly fetched = signal<LiveData<Album> | undefined>(undefined);

	protected readonly cover = computed(() => {
		const album = this.album();
		const fetched = this.fetched()?.value();
		return (
			album.titlePhotos?.[0] ??
			album.previewPhotos?.[0] ??
			fetched?.titlePhotos?.[0] ??
			fetched?.previewPhotos?.[0] ??
			undefined
		);
	});
	protected readonly link = computed(() => {
		const reportId = this.reportId();
		return reportId ? ["/jak-jsme-se-meli", reportId] : ["/jak-jsme-se-meli/album", this.album()._id];
	});
	protected readonly name = computed(() => albumName(this.album().name));
	protected readonly dates = computed(() => albumDates(this.album().dateFrom, this.album().dateTill));

	constructor() {
		afterNextRender(() => {
			if (this.cover() || !this.preview() || typeof IntersectionObserver === "undefined") return;
			const observer = new IntersectionObserver(
				(entries) => {
					if (!entries.some((entry) => entry.isIntersecting)) return;
					observer.disconnect();
					if (!this.cover()) this.fetched.set(this.api.albumPreview(this.album()._id));
				},
				{ rootMargin: "300px" },
			);
			observer.observe(this.host.nativeElement);
		});
	}
}
