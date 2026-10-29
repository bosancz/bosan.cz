import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { JournalItem } from "../../core/schema";
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
	readonly item = input.required<JournalItem>();
	readonly eager = input(false);

	protected readonly cover = computed(() => this.item().photo ?? undefined);
	protected readonly link = computed(() => {
		const { reportId, albumId } = this.item();
		return reportId ? ["/jak-jsme-se-meli", reportId] : ["/jak-jsme-se-meli/album", albumId];
	});
	protected readonly badges = computed(() => {
		const item = this.item();
		return [...(item.summary ? ["Shrnutí"] : []), ...(item.chronicle ? ["Kronika"] : [])];
	});
	protected readonly name = computed(() => albumName(this.item().name));
	protected readonly dates = computed(() => albumDates(this.item().dateFrom, this.item().dateTill));
}
