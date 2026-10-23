import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	inject,
	input,
	OnInit,
	signal,
	untracked,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiService, LiveData } from "../../core/api.service";
import { groupInfo, sortGroupIds } from "../../core/groups";
import { MarkdownPipe, markdownToText } from "../../core/markdown";
import { PublicReport } from "../../core/schema";
import { OG_IMAGE_SIZE, SeoService } from "../../core/seo.service";
import { reportDates, reportPhoto, reportWater } from "./report-format";

@Component({
	selector: "bo-report-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, MarkdownPipe],
	templateUrl: "./report-page.html",
	styleUrl: "./report-page.scss",
})
export class ReportPage implements OnInit {
	readonly report = input.required<string>();

	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly source = signal<LiveData<PublicReport> | undefined>(undefined);

	protected readonly data = computed(() => this.source()?.value());
	protected readonly failed = computed(() => !this.data() && !!this.source()?.error());
	protected readonly dates = computed(() => {
		const report = this.data();
		return report ? reportDates(report) : "";
	});
	protected readonly groups = computed(() => sortGroupIds(this.data()?.groups ?? []).map(groupInfo));
	protected readonly water = computed(() => {
		const report = this.data();
		return report ? reportWater(report) : "";
	});
	protected readonly leaders = computed(() => (this.data()?.leaders ?? []).map((l) => l.nickname).join(", "));
	protected readonly photo = computed(() => {
		const report = this.data();
		return report ? reportPhoto(report, "big") : null;
	});

	ngOnInit(): void {
		this.source.set(this.api.report(this.report()));
	}

	constructor() {
		effect(() => {
			const report = this.data();
			const failed = this.failed();
			untracked(() => {
				if (report) this.setSeo(report);
				else if (failed) {
					this.seo.set({
						title: "Report nenalezen",
						description: "Požadovaný report z akce dětské vodácké skupiny ŠÁN se nepodařilo najít.",
						path: `/reporty/${this.report()}`,
						noindex: true,
					});
				}
			});
		});
	}

	private setSeo(report: PublicReport): void {
		const name = report.name.trim();
		const text = markdownToText(report.report);
		const path = `/reporty/${report._id}`;
		this.seo.set({
			title: `${name} – report z akce`,
			description: text.slice(0, 160),
			path,
			image: `/og/report-${report._id}.jpg`,
			imageSize: OG_IMAGE_SIZE,
			imageAlt: name,
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: `${name} – report z akce`,
				datePublished: report.reportPublishedAt,
				articleBody: text,
				image: reportPhoto(report, "big") ?? undefined,
				url: this.seo.absoluteUrl(path),
				author: { "@type": "Organization", name: "Dětská vodácká skupina ŠÁN", url: this.seo.absoluteUrl("/") },
			},
		});
	}
}
