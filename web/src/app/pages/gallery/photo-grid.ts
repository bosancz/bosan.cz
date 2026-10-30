import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AlbumPhoto } from "../../core/schema";

@Component({
	selector: "bo-photo-grid",
	imports: [RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./photo-grid.html",
	styleUrl: "./photo-grid.scss",
})
export class PhotoGrid {
	readonly albumId = input.required<string>();
	readonly albumName = input.required<string>();
	readonly photos = input.required<AlbumPhoto[]>();
	readonly eager = input(8);

	protected readonly state = { fromAlbum: true };

	protected ratio(photo: AlbumPhoto): number {
		return photo.width && photo.height ? photo.width / photo.height : 1.5;
	}
}
