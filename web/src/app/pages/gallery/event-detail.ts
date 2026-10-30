import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AccountService } from "../../core/account.service";
import { GroupInfo } from "../../core/groups";
import { MarkdownPipe } from "../../core/markdown";
import { AlbumPhoto, ReportChronicle } from "../../core/schema";
import { TypographyPipe } from "../../core/typography";
import { PageToc, PageTocSection } from "../../components/page-toc";
import { chronicleSize } from "../reports/report-format";
import { photoCount } from "./gallery-dates";
import { PhotoGrid } from "./photo-grid";

@Component({
	selector: "bo-event-detail",
	imports: [RouterLink, MarkdownPipe, TypographyPipe, PhotoGrid, PageToc],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./event-detail.html",
	styleUrl: "./event-detail.scss",
})
export class EventDetail {
	readonly name = input<string>();
	readonly dateFrom = input<string>();
	readonly dates = input("");
	readonly water = input("");
	readonly groups = input<GroupInfo[]>([]);
	readonly leaders = input("");
	readonly description = input<string | null>(null);
	readonly summary = input<string | null>(null);
	readonly chronicle = input<ReportChronicle | null>(null);
	readonly albumId = input<string | null>(null);
	readonly photos = input<AlbumPhoto[]>([]);
	readonly photosLoaded = input(false);
	readonly photosFailed = input(false);
	readonly downloadHref = input<string | undefined>();
	readonly failed = input(false);
	readonly failedTitle = input("");
	readonly failedText = input("");
	readonly interniHref = input<string | null>(null);

	protected readonly account = inject(AccountService);

	protected readonly chronicleSize = chronicleSize;
	protected readonly photoCount = photoCount;
	protected readonly tocSections = computed<PageTocSection[] | null>(() => {
		if (!this.summary() || !this.albumId()) return null;
		return [
			{ id: "shrnuti", label: "shrnutí" },
			{ id: "fotogalerie", label: "fotogalerie" },
		];
	});
}
