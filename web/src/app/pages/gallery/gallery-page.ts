import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	Injector,
	afterNextRender,
	computed,
	effect,
	inject,
	signal,
	viewChild,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { Album, PublicReport } from "../../core/schema";
import { parseDate } from "../../core/dates";
import { SeoService } from "../../core/seo.service";
import { AlbumCard } from "./album-card";

interface GalleryItem {
	key: string;
	album: Album;
	reportId: string | null;
	hasAlbum: boolean;
	badges: string[];
}

function searchText(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim();
}

function reportBadges(report: PublicReport | undefined): string[] {
	if (!report) return [];
	return [...(report.report ? ["Shrnutí"] : []), ...(report.chronicle ? ["Kronika"] : [])];
}

interface YearGroup {
	year: number;
	items: GalleryItem[];
	weight: number;
}

function reportAlbum(report: PublicReport): Album {
	return {
		_id: report._id,
		year: Number(report.dateFrom.slice(0, 4)),
		status: "public",
		name: report.name,
		description: null,
		datePublished: report.reportPublishedAt,
		dateFrom: report.dateFrom,
		dateTill: report.dateTill,
		titlePhotos: [],
	};
}

const INITIAL_YEARS = 2;

let savedView: { loadedYears: number; scrollY: number } | null = null;

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
	private readonly reports = this.api.reports();
	protected readonly loadedYears = signal(INITIAL_YEARS);
	protected readonly activeYear = signal<number | undefined>(undefined);
	protected readonly query = signal("");

	protected readonly groups = computed<YearGroup[]>(() => {
		const reports = this.reports.value() ?? [];
		const reportByAlbum = new Map(reports.filter((r) => r.album).map((r) => [r.album!._id, r]));
		const items: GalleryItem[] = [
			...(this.albums.value() ?? []).map((album) => ({
				key: `album-${album._id}`,
				album: reportByAlbum.has(album._id) ? { ...album, name: reportByAlbum.get(album._id)!.name } : album,
				reportId: reportByAlbum.get(album._id)?._id ?? null,
				hasAlbum: true,
				badges: reportBadges(reportByAlbum.get(album._id)),
			})),
			...reports
				.filter((r) => !r.album)
				.map((r) => ({
					key: `report-${r._id}`,
					album: reportAlbum(r),
					reportId: r._id,
					hasAlbum: false,
					badges: reportBadges(r),
				})),
		];
		const query = searchText(this.query());
		const byYear = new Map<number, GalleryItem[]>();
		for (const item of items) {
			if (query && !searchText(item.album.name).includes(query)) continue;
			if (!item.album.dateFrom) continue;
			const year = parseDate(item.album.dateFrom).getUTCFullYear();
			byYear.set(year, [...(byYear.get(year) ?? []), item]);
		}
		return [...byYear.entries()]
			.sort((a, b) => b[0] - a[0])
			.map(([year, items]) => ({
				year,
				items: items.sort((a, b) => b.album.dateFrom.localeCompare(a.album.dateFrom)),
				weight: items.length + 4,
			}));
	});
	protected readonly visibleGroups = computed(() =>
		this.query().trim() ? this.groups() : this.groups().slice(0, this.loadedYears()),
	);
	protected readonly loaded = computed(() => this.albums.value() !== undefined && this.reports.value() !== undefined);
	protected readonly current = computed(() => this.activeYear() ?? this.groups()[0]?.year);

	constructor() {
		const router = inject(Router);
		const restore = router.currentNavigation()?.trigger === "popstate" ? savedView : null;
		if (restore) {
			this.loadedYears.set(restore.loadedYears);
			const restoreEffect = effect(() => {
				if (this.albums.value() === undefined || this.reports.value() === undefined) return;
				restoreEffect.destroy();
				afterNextRender(() => window.scrollTo({ top: restore.scrollY }), { injector: this.injector });
			});
		}

		inject(SeoService).set({
			title: "Jak jsme se měli",
			description:
				"Fotky a kroniky dětské vodácké skupiny ŠÁN: alba z výprav, táborů, puťáků, závodů i oddílových akcí od roku 1987 až po dnešek.",
			path: "/jak-jsme-se-meli",
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "CollectionPage",
				name: "Jak jsme se měli – ŠÁN",
				url: "https://bosan.cz/jak-jsme-se-meli",
			},
		});

		afterNextRender(() => {
			let frame = 0;
			const onScroll = () => {
				if (!router.currentNavigation())
					savedView = { loadedYears: this.loadedYears(), scrollY: window.scrollY };
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

	protected onSearch(value: string): void {
		this.query.set(value);
		this.activeYear.set(undefined);
		afterNextRender(() => this.updateActive(), { injector: this.injector });
	}

	protected hasMore(): boolean {
		return this.loadedYears() < this.groups().length;
	}

	protected loadMore(): void {
		if (this.hasMore()) this.loadedYears.update((n) => n + 1);
	}

	protected onRailLink(event: MouseEvent, year: number): void {
		event.preventDefault();
		if (event.detail === 0) this.goTo(year, 0);
	}

	protected onRailPointerDown(event: PointerEvent): void {
		if (event.button) return;
		event.preventDefault();
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
		const rect = hit.getBoundingClientRect();
		const fraction = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
		this.goTo(Number(hit.dataset["year"]), fraction);
	}

	private goTo(year: number, fraction: number): void {
		const index = this.groups().findIndex((group) => group.year === year);
		if (index < 0) return;
		this.activeYear.set(year);
		if (index >= this.loadedYears()) {
			this.loadedYears.set(index + 1);
			afterNextRender(() => this.scrollToYear(year, fraction), { injector: this.injector });
		} else {
			this.scrollToYear(year, fraction);
		}
	}

	private scrollToYear(year: number, fraction: number): void {
		const element = this.document.getElementById(`rok-${year}`);
		if (!element) return;
		const rect = element.getBoundingClientRect();
		window.scrollTo({
			top: rect.top + window.scrollY - 24 + fraction * Math.max(0, rect.height - window.innerHeight / 2),
		});
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
