import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	Injector,
	afterNextRender,
	computed,
	inject,
	signal,
	viewChild,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { ApiService } from "../../core/api.service";
import { Album } from "../../core/schema";
import { parseDate } from "../../core/dates";
import { SeoService } from "../../core/seo.service";
import { AlbumCard } from "./album-card";

interface YearGroup {
	year: number;
	albums: Album[];
	weight: number;
}

const INITIAL_YEARS = 2;

@Component({
	selector: "bo-gallery-page",
	imports: [AlbumCard],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./gallery-page.html",
	styleUrl: "./gallery-page.scss",
})
export class GalleryPage {
	private readonly api = inject(ApiService);
	private readonly document = inject(DOCUMENT);
	private readonly injector = inject(Injector);
	private readonly destroyRef = inject(DestroyRef);
	private readonly rail = viewChild<ElementRef<HTMLElement>>("rail");
	private readonly sentinel = viewChild<ElementRef<HTMLElement>>("sentinel");

	protected readonly albums = this.api.gallery();
	protected readonly loadedYears = signal(INITIAL_YEARS);
	protected readonly activeYear = signal<number | undefined>(undefined);

	protected readonly groups = computed<YearGroup[]>(() => {
		const byYear = new Map<number, Album[]>();
		for (const album of this.albums.value() ?? []) {
			if (!album.dateFrom) continue;
			const year = parseDate(album.dateFrom).getUTCFullYear();
			byYear.set(year, [...(byYear.get(year) ?? []), album]);
		}
		return [...byYear.entries()]
			.sort((a, b) => b[0] - a[0])
			.map(([year, albums]) => ({ year, albums, weight: albums.length + 4 }));
	});
	protected readonly visibleGroups = computed(() => this.groups().slice(0, this.loadedYears()));
	protected readonly current = computed(() => this.activeYear() ?? this.groups()[0]?.year);

	constructor() {
		inject(SeoService).set({
			title: "Fotogalerie",
			description:
				"Fotogalerie dětské vodácké skupiny ŠÁN: alba z výprav, táborů, puťáků, závodů i oddílových akcí od roku 1996 až po dnešek.",
			path: "/fotogalerie",
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "CollectionPage",
				name: "Fotogalerie ŠÁN",
				url: "https://bosan.cz/fotogalerie",
			},
		});

		afterNextRender(() => {
			let frame = 0;
			const onScroll = () => {
				if (frame) return;
				frame = requestAnimationFrame(() => {
					frame = 0;
					this.updateActive();
				});
			};
			window.addEventListener("scroll", onScroll, { passive: true });
			window.addEventListener("resize", onScroll, { passive: true });
			this.destroyRef.onDestroy(() => {
				window.removeEventListener("scroll", onScroll);
				window.removeEventListener("resize", onScroll);
				cancelAnimationFrame(frame);
			});
			this.updateActive();

			const target = this.sentinel()?.nativeElement;
			if (target && typeof IntersectionObserver !== "undefined") {
				const observer = new IntersectionObserver(
					(entries) => {
						if (!entries.some((entry) => entry.isIntersecting)) return;
						this.loadMore();
						setTimeout(() => {
							observer.unobserve(target);
							observer.observe(target);
						}, 80);
					},
					{ rootMargin: "900px 0px" },
				);
				observer.observe(target);
				this.destroyRef.onDestroy(() => observer.disconnect());
			}
		});
	}

	protected hasMore(): boolean {
		return this.loadedYears() < this.groups().length;
	}

	protected loadMore(): void {
		if (this.hasMore()) this.loadedYears.update((n) => n + 1);
	}

	protected onRailLink(event: Event, year: number): void {
		event.preventDefault();
		this.goTo(year);
	}

	protected onRailPointerDown(event: PointerEvent): void {
		if (event.button) return;
		const body = event.currentTarget as HTMLElement;
		body.setPointerCapture(event.pointerId);
		this.goToPointer(event);
	}

	protected onRailPointerMove(event: PointerEvent): void {
		const body = event.currentTarget as HTMLElement;
		if (body.hasPointerCapture(event.pointerId)) this.goToPointer(event);
	}

	private goToPointer(event: PointerEvent): void {
		const rows = Array.from((event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>("[data-year]"));
		if (!rows.length) return;
		let hit = rows[rows.length - 1];
		for (const row of rows) {
			if (event.clientY < row.getBoundingClientRect().bottom) {
				hit = row;
				break;
			}
		}
		const year = Number(hit.dataset["year"]);
		if (year !== this.activeYear()) this.goTo(year);
	}

	private goTo(year: number): void {
		const index = this.groups().findIndex((group) => group.year === year);
		if (index < 0) return;
		this.activeYear.set(year);
		if (index >= this.loadedYears()) this.loadedYears.set(index + 1);
		afterNextRender(
			() => {
				const element = this.document.getElementById(`rok-${year}`);
				if (element) window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 24 });
			},
			{ injector: this.injector },
		);
	}

	private updateActive(): void {
		const sections = Array.from(this.document.querySelectorAll<HTMLElement>("[data-year-section]"));
		let year: number | undefined;
		for (const section of sections) {
			if (section.getBoundingClientRect().top <= 160) year = Number(section.dataset["yearSection"]);
			else break;
		}
		if (year === undefined && sections.length) year = Number(sections[0].dataset["yearSection"]);
		if (year !== undefined && year !== this.activeYear()) this.activeYear.set(year);
	}
}
