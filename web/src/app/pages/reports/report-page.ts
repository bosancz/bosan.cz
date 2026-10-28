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
import { Album, Photo, PublicReport } from "../../core/schema";
import { OG_IMAGE_SIZE, SeoService } from "../../core/seo.service";
import { chronicleSize, reportDates, reportPhoto, reportWater } from "./report-format";
import { TypographyPipe } from "../../core/typography";
import { photoCount } from "../gallery/gallery-dates";
import { PhotoGrid } from "../gallery/photo-grid";
import { PageToc, PageTocSection } from "../../components/page-toc";

@Component({
	selector: "bo-report-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, MarkdownPipe, TypographyPipe, PhotoGrid, PageToc],
	templateUrl: "./report-page.html",
	styleUrl: "./report-page.scss",
})
export class ReportPage implements OnInit {
	readonly report = input.required<string>();

	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly source = signal<LiveData<PublicReport> | undefined>(undefined);

	private readonly albumSource = signal<LiveData<Album> | undefined>(undefined);
	private albumId?: string;

	protected readonly chronicleSize = chronicleSize;
	protected readonly photoCount = photoCount;
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
	protected readonly tocSections = computed<PageTocSection[] | null>(() => {
		const report = this.data();
		if (!report?.report || !report.album) return null;
		return [
			{ id: "shrnuti", label: "shrnutí" },
			{ id: "fotogalerie", label: "fotogalerie" },
		];
	});
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
						path: `/kroniky/${this.report()}`,
						noindex: true,
					});
				}
			});
		});
	}

	private setSeo(report: PublicReport): void {
		const name = report.name.trim();
		const text = markdownToText(report.report);
		const path = `/kroniky/${report._id}`;
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
