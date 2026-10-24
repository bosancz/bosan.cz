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
			padding: 22px 24px 16px 52px;
			background: #fff;
			border-radius: 14px;
			box-shadow: 0 6px 20px rgba(42, 52, 120, 0.09);
		}

		:host::before {
			content: "„";
			position: absolute;
			left: 16px;
			top: -6px;
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
				padding: 18px 18px 14px 40px;
			}

			:host::before {
				left: 10px;
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
