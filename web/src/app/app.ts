import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HydrationState } from "./core/hydration-state";
import { SiteFooter } from "./layout/site-footer/site-footer";
import { SiteHeader } from "./layout/site-header/site-header";

@Component({
	selector: "bo-root",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterOutlet, SiteHeader, SiteFooter],
	templateUrl: "./app.html",
	styleUrl: "./app.scss",
})
export class App {
	constructor() {
		inject(HydrationState);
	}
}
