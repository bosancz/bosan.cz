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

	protected readonly link = computed(() => ["/jak-jsme-se-meli/album", this.item().albumId]);
	protected readonly badges = computed(() => (this.item().chronicle ? ["Kronika"] : []));
	protected readonly name = computed(() => albumName(this.item().name));
	protected readonly dates = computed(() => albumDates(this.item().dateFrom, this.item().dateTill));
}
