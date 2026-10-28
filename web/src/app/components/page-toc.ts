import {
	ChangeDetectionStrategy,
	Component,
	DOCUMENT,
	DestroyRef,
	Injector,
	afterNextRender,
	computed,
	inject,
	input,
	signal,
} from "@angular/core";
import { goToSection } from "../core/page-sections";

export interface PageTocSection {
	id: string;
	label: string;
}

@Component({
	selector: "bo-page-toc",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./page-toc.html",
	styleUrl: "./page-toc.scss",
	host: { role: "navigation", "aria-label": "Obsah stránky" },
})
export class PageToc {
	readonly sections = input.required<PageTocSection[]>();

	private readonly document = inject(DOCUMENT);
	private readonly injector = inject(Injector);

	private readonly scrolled = signal<string | null>(null);
	protected readonly active = computed(() => this.scrolled() ?? this.sections()[0]?.id ?? null);
	protected readonly activeLabel = computed(
		() => this.sections().find((section) => section.id === this.active())?.label ?? "",
	);
	protected readonly open = signal(false);

	constructor() {
		const destroyRef = inject(DestroyRef);
		afterNextRender(() => {
			const view = this.document.defaultView;
			if (!view) return;
			const update = () => {
				const offset = view.innerHeight * 0.35;
				let current: string | null = null;
				for (const section of this.sections()) {
					const element = this.document.getElementById(section.id);
					if (element && element.getBoundingClientRect().top <= offset) current = section.id;
				}
				this.scrolled.set(current);
			};
			update();
			view.addEventListener("scroll", update, { passive: true });
			view.addEventListener("resize", update, { passive: true });
			destroyRef.onDestroy(() => {
				view.removeEventListener("scroll", update);
				view.removeEventListener("resize", update);
			});
		});
	}

	protected go(event: Event, id: string | null): void {
		event.preventDefault();
		this.open.set(false);
		afterNextRender(() => goToSection(this.document, id), { injector: this.injector });
		if (id) this.scrolled.set(id);
	}
}
