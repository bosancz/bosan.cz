import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
	selector: "bo-site-footer",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: "./site-footer.html",
	styleUrl: "./site-footer.scss",
})
export class SiteFooter {}
