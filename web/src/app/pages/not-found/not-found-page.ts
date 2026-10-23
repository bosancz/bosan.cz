import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SeoService } from "../../core/seo.service";

@Component({
	selector: "bo-not-found-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: "./not-found-page.html",
	styleUrl: "./not-found-page.scss",
})
export class NotFoundPage {
	constructor() {
		inject(SeoService).set({
			title: "Stránka nenalezena",
			description: "Tahle stránka na webu skupiny ŠÁN neexistuje. Zkus program, fotogalerii nebo informace o táboře.",
			path: "/404",
			noindex: true,
		});
	}
}
