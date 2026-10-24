import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { TypographyDirective } from "../core/typography";

@Component({
	selector: "bo-quote",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TypographyDirective],
	template: `
		<figure>
			<blockquote boTypography><ng-content /></blockquote>
			<figcaption>{{ author() }}</figcaption>
		</figure>
	`,
	styles: `
		@use "styles/breakpoints" as bp;

		:host {
			display: block;
			position: relative;
			padding: 0 0 0 40px;
		}

		:host::before {
			content: "„";
			position: absolute;
			left: 0;
			top: 0;
			transform: translateY(-0.5em);
			font: 400 64px/1 var(--font-display);
			color: var(--orange);
		}

		figure {
			margin: 0;
		}

		blockquote {
			margin: 0;
			font-size: 16px;
			line-height: 1.6;
			color: var(--body-text);
		}

		figcaption {
			margin-top: 8px;
			text-align: right;
			font: 400 20px/1.2 var(--font-display);
			color: var(--navy);
		}

		figcaption::before {
			content: "— ";
			color: var(--orange);
		}

		@include bp.mobile {
			:host {
				padding: 0 0 0 32px;
			}

			:host::before {
				font-size: 52px;
			}

			blockquote {
				font-size: 15px;
			}

			figcaption {
				font-size: 18px;
			}
		}
	`,
})
export class Quote {
	readonly author = input.required<string>();
}
