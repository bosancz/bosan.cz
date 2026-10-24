import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

@Component({
	selector: "bo-omission",
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<button
		type="button"
		[attr.aria-expanded]="open()"
		[attr.title]="open() ? 'Skrýt vynechaný text' : 'Zobrazit vynechaný text'"
		(click)="open.set(!open())"
	>
		<span class="mark">[</span><span class="mark" [hidden]="open()">…</span
		><span class="text" [hidden]="!open()"><ng-content /></span><span class="mark">]</span>
	</button>`,
	styles: `
		button {
			display: inline;
			padding: 0;
			border: 0;
			background: none;
			font: inherit;
			color: inherit;
			text-align: inherit;
			cursor: pointer;
		}

		.mark {
			color: var(--orange);
		}

		button:hover .mark,
		button:focus-visible .mark {
			text-decoration: underline;
		}

		.text {
			color: var(--muted);
			font-style: italic;
		}
	`,
})
export class Omission {
	protected readonly open = signal(false);
}
