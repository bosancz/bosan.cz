import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Omission } from "../../components/omission";
import { Quote } from "../../components/quote";
import { TypographyDirective } from "../../core/typography";

@Component({
	selector: "bo-about-history",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [Omission, Quote, TypographyDirective],
	templateUrl: "./about-history.html",
	styleUrl: "./about-history.scss",
})
export class AboutHistory {}
