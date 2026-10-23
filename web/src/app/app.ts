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

	protected skip(event: Event): void {
		event.preventDefault();
		const main = document.getElementById("obsah");
		main?.focus();
		main?.scrollIntoView();
	}
}
