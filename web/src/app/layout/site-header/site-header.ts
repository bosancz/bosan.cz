import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { filter, map } from "rxjs";
import { INTERNAL_URL, NAV_ITEMS } from "../nav-items";

@Component({
	selector: "bo-site-header",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, RouterLinkActive],
	templateUrl: "./site-header.html",
	styleUrl: "./site-header.scss",
})
export class SiteHeader {
	private readonly router = inject(Router);

	protected readonly items = NAV_ITEMS;
	protected readonly internalUrl = INTERNAL_URL;
	protected readonly menuOpen = signal(false);

	private readonly url = toSignal(
		this.router.events.pipe(
			filter((event) => event instanceof NavigationEnd),
			map((event) => (event as NavigationEnd).urlAfterRedirects),
		),
		{ initialValue: this.router.url },
	);

	protected readonly current = computed(() => {
		const path = (this.url() ?? "/").split(/[?#]/)[0];
		return (
			[...this.items]
				.sort((a, b) => b.path.length - a.path.length)
				.find((item) => (item.path === "/" ? path === "/" : path.startsWith(item.path))) ?? null
		);
	});

	constructor() {
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.subscribe(() => this.menuOpen.set(false));
	}

	protected toggle(event: Event): void {
		this.menuOpen.set((event.target as HTMLDetailsElement).open);
	}
}
