import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { APP_VERSION } from "../../../environments/version";

@Component({
	selector: "bo-site-footer",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: "./site-footer.html",
	styleUrl: "./site-footer.scss",
})
export class SiteFooter {
	protected readonly version = APP_VERSION;
}
