import { ViewportScroller, isPlatformBrowser } from "@angular/common";
import { DOCUMENT, Injectable, PLATFORM_ID, inject } from "@angular/core";

@Injectable()
export class SectionViewportScroller extends ViewportScroller {
	private readonly document = inject(DOCUMENT);
	private readonly window = isPlatformBrowser(inject(PLATFORM_ID)) ? this.document.defaultView : null;
	private offset: () => [number, number] = () => [0, 0];

	setOffset(offset: [number, number] | (() => [number, number])): void {
		this.offset = Array.isArray(offset) ? () => offset : offset;
	}

	getScrollPosition(): [number, number] {
		return this.window ? [this.window.scrollX, this.window.scrollY] : [0, 0];
	}

	scrollToPosition(position: [number, number], options?: ScrollOptions): void {
		this.window?.scrollTo({ ...options, left: position[0], top: position[1] });
	}

	scrollToAnchor(anchor: string, options?: ScrollOptions): void {
		const element = this.document.getElementById(anchor) ?? this.document.getElementsByName(anchor)[0];
		if (!element) return;
		const [left, top] = this.offset();
		element.scrollIntoView({ ...options, block: "start" });
		if (left || top) this.window?.scrollBy({ left: -left, top: -top });
	}

	setHistoryScrollRestoration(scrollRestoration: "auto" | "manual"): void {
		try {
			if (this.window) this.window.history.scrollRestoration = scrollRestoration;
		} catch {}
	}
}
