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
import { ApiService, LiveData } from "../../core/api.service";
import { groupInfo, sortGroupIds } from "../../core/groups";
import { markdownToText } from "../../core/markdown";
import { Album, Photo, PublicReport } from "../../core/schema";
import { OG_IMAGE_SIZE, SeoService } from "../../core/seo.service";
import { reportDates, reportPhoto, reportWater } from "./report-format";
import { EventDetail } from "../gallery/event-detail";

@Component({
	selector: "bo-report-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [EventDetail],
	templateUrl: "./report-page.html",
})
export class ReportPage implements OnInit {
	readonly report = input.required<string>();

	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly source = signal<LiveData<PublicReport> | undefined>(undefined);

	protected readonly albumSource = signal<LiveData<Album> | undefined>(undefined);
	private albumId?: string;

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

	protected readonly photos = computed<Photo[]>(() =>
		(this.albumSource()?.value()?.photos ?? []).filter((p) => p.sizes?.small),
	);
	protected readonly downloadHref = computed(() => this.albumSource()?.value()?._links?.download?.href);
	protected readonly albumFailed = computed(() => !!this.albumSource()?.error());

	ngOnInit(): void {
		this.source.set(this.api.report(this.report()));
	}

	constructor() {
		effect(() => {
			const albumId = this.data()?.album?._id;
			untracked(() => {
				if (!albumId || albumId === this.albumId) return;
				this.albumId = albumId;
				this.albumSource.set(this.api.album(albumId));
			});
		});

		effect(() => {
			const report = this.data();
			const failed = this.failed();
			untracked(() => {
				if (report) this.setSeo(report);
				else if (failed) {
					this.seo.set({
						title: "Kronika nenalezena",
						description: "Požadovanou kroniku akce dětské vodácké skupiny ŠÁN se nepodařilo najít.",
						path: `/jak-jsme-se-meli/${this.report()}`,
						noindex: true,
					});
				}
			});
		});
	}

	private setSeo(report: PublicReport): void {
		const name = report.name.trim();
		const text = markdownToText(report.report);
		const path = `/jak-jsme-se-meli/${report._id}`;
		this.seo.set({
			title: `${name} – kronika akce`,
			description: (text || `Kronika akce ${name} v PDF ke stažení.`).slice(0, 160),
			path,
			image: `/og/report-${report._id}.jpg`,
			imageSize: OG_IMAGE_SIZE,
			imageAlt: name,
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: `${name} – kronika akce`,
				datePublished: report.reportPublishedAt,
				articleBody: text,
				image: reportPhoto(report, "big") ?? undefined,
				url: this.seo.absoluteUrl(path),
				author: { "@type": "Organization", name: "Dětská vodácká skupina ŠÁN", url: this.seo.absoluteUrl("/") },
			},
		});
	}
}
