import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { groupInfo, sortGroupIds } from "../../core/groups";
import { SeoService } from "../../core/seo.service";
import { reportDates, reportExcerpt, reportPhoto, reportWater } from "./report-format";

@Component({
	selector: "bo-reports-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: "./reports-page.html",
	styleUrl: "./reports-page.scss",
})
export class ReportsPage {
	private readonly source = inject(ApiService).reports();

	protected readonly loading = computed(() => this.source.loading() && !this.source.value());
	protected readonly failed = computed(() => !!this.source.error() && !this.source.value());
	protected readonly reports = computed(() =>
		[...(this.source.value() ?? [])]
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
			})),
	);

	constructor() {
		inject(SeoService).set({
			title: "Reporty z akcí",
			description:
				"Jak jsme si užili výpravy, vodu i tábor: reporty z akcí dětské vodácké skupiny ŠÁN psané vedoucími.",
			path: "/reporty",
			image: "/img/og-default.jpg",
			imageAlt: "Dětská vodácká skupina ŠÁN",
		});
	}
}
