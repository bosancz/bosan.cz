import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiService, REPORTS_PAGE } from "../../core/api.service";
import { PublicReport } from "../../core/schema";
import { groupInfo, sortGroupIds } from "../../core/groups";
import { SeoService } from "../../core/seo.service";
import { reportDates, reportExcerpt, reportPhoto, reportWater } from "./report-format";
import { TypographyPipe } from "../../core/typography";

@Component({
	selector: "bo-reports-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, TypographyPipe],
	templateUrl: "./reports-page.html",
	styleUrl: "./reports-page.scss",
})
export class ReportsPage {
	private readonly api = inject(ApiService);
	private readonly source = this.api.reports();
	private readonly older = signal<PublicReport[]>([]);
	private readonly exhausted = signal(false);
	protected readonly loadingMore = signal(false);
	protected readonly hasMore = computed(
		() => !this.exhausted() && (this.source.value()?.length ?? 0) + this.older().length >= REPORTS_PAGE,
	);

	protected readonly loading = computed(() => this.source.loading() && !this.source.value());
	protected readonly failed = computed(() => !!this.source.error() && !this.source.value());
	protected readonly reports = computed(() =>
		[...(this.source.value() ?? []), ...this.older()]
			.filter((report, index, all) => all.findIndex((other) => other._id === report._id) === index)
			.sort((a, b) => b.reportPublishedAt.localeCompare(a.reportPublishedAt))
			.map((report) => ({
				id: report._id,
				name: report.name.trim(),
				dates: reportDates(report),
				from: report.dateFrom.slice(0, 10),
				groups: sortGroupIds(report.groups).map(groupInfo),
				water: reportWater(report),
				text: reportExcerpt(report.report, 260),
				photo: reportPhoto(report, "small"),
				bg: report.album?.titlePhoto?.bg ?? "#c9cee9",
				albumId: report.album?._id ?? null,
				chronicleUrl: report.chronicle ? report.chronicle.url : null,
			})),
	);

	protected async loadMore(): Promise<void> {
		this.loadingMore.set(true);
		try {
			const page = await this.api.fetchReports((this.source.value()?.length ?? 0) + this.older().length);
			this.older.update((list) => [...list, ...page]);
			if (page.length < REPORTS_PAGE) this.exhausted.set(true);
		} finally {
			this.loadingMore.set(false);
		}
	}

	constructor() {
		inject(SeoService).set({
			title: "Kroniky akcí",
			description: "O čem byly výpravy, vodácké akce a tábory dětské vodácké skupiny ŠÁN.",
			path: "/kroniky",
			image: "/img/og-default.jpg",
			imageAlt: "Dětská vodácká skupina ŠÁN",
		});
	}
}
