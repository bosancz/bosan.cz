import { isPlatformBrowser } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	PLATFORM_ID,
	afterNextRender,
	computed,
	effect,
	inject,
	input,
	signal,
	untracked,
	viewChildren,
} from "@angular/core";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, PDFPageProxy, RenderTask } from "pdfjs-dist";

interface ChroniclePage {
	number: number;
	ratio: number;
}

const COLLAPSED_PAGES = 2;

let pdfjs: Promise<typeof import("pdfjs-dist")> | undefined;

function loadPdfjs(): Promise<typeof import("pdfjs-dist")> {
	pdfjs ??= import("pdfjs-dist").then((lib) => {
		lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
		return lib;
	});
	return pdfjs;
}

function pagesLabel(count: number): string {
	if (count === 1) return "1 strana";
	if (count >= 2 && count <= 4) return `${count} strany`;
	return `${count} stran`;
}

@Component({
	selector: "bo-chronicle-viewer",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./chronicle-viewer.html",
	styleUrl: "./chronicle-viewer.scss",
})
export class ChronicleViewer {
	readonly url = input.required<string>();
	readonly name = input("");

	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));

	private readonly canvases = viewChildren<ElementRef<HTMLCanvasElement>>("canvas");

	protected readonly pages = signal<ChroniclePage[]>([]);
	protected readonly failed = signal(false);
	protected readonly expanded = signal(false);
	protected readonly shownPages = computed(() =>
		this.expanded() ? this.pages() : this.pages().slice(0, COLLAPSED_PAGES),
	);
	protected readonly hiddenCount = computed(() => this.pages().length - this.shownPages().length);
	protected readonly pagesLabel = pagesLabel;

	private loading: PDFDocumentLoadingTask | undefined;
	private document: PDFDocumentProxy | undefined;
	private readonly rendered = new Map<number, number>();
	private readonly tasks = new Map<number, RenderTask>();
	private readonly visible = new Set<number>();
	private observer: IntersectionObserver | undefined;
	private width = 0;

	constructor() {
		const destroyRef = inject(DestroyRef);

		afterNextRender(() => {
			this.observer = new IntersectionObserver((entries) => this.onIntersect(entries), {
				rootMargin: "800px 0px",
			});
			const resize = new ResizeObserver(() => this.onResize());
			resize.observe(this.host.nativeElement);
			destroyRef.onDestroy(() => resize.disconnect());
		});

		effect(() => {
			const url = this.url();
			if (!this.browser) return;
			untracked(() => this.open(url));
		});

		effect(() => {
			const canvases = this.canvases();
			untracked(() => {
				if (!this.observer) return;
				this.observer.disconnect();
				for (const canvas of canvases) this.observer.observe(canvas.nativeElement);
			});
		});

		destroyRef.onDestroy(() => {
			this.observer?.disconnect();
			for (const task of this.tasks.values()) task.cancel();
			void this.loading?.destroy();
		});
	}

	protected expand(): void {
		this.expanded.set(true);
	}

	private async open(url: string): Promise<void> {
		this.failed.set(false);
		this.pages.set([]);
		this.rendered.clear();
		this.visible.clear();
		void this.loading?.destroy();
		this.document = undefined;
		this.loading = undefined;
		try {
			const lib = await loadPdfjs();
			const loading = lib.getDocument({ url });
			this.loading = loading;
			const document = await loading.promise;
			if (loading !== this.loading) return;
			this.document = document;
			const pages: ChroniclePage[] = [];
			for (let number = 1; number <= document.numPages; number++) {
				const page = await document.getPage(number);
				const viewport = page.getViewport({ scale: 1 });
				pages.push({ number, ratio: viewport.width / viewport.height });
			}
			this.width = this.pageWidth();
			this.pages.set(pages);
		} catch {
			this.failed.set(true);
		}
	}

	private onIntersect(entries: IntersectionObserverEntry[]): void {
		for (const entry of entries) {
			const number = Number((entry.target as HTMLElement).dataset["page"]);
			if (entry.isIntersecting) {
				this.visible.add(number);
				void this.render(number, entry.target as HTMLCanvasElement);
			} else {
				this.visible.delete(number);
			}
		}
	}

	private resizeTimer: ReturnType<typeof setTimeout> | undefined;

	private onResize(): void {
		clearTimeout(this.resizeTimer);
		this.resizeTimer = setTimeout(() => {
			const width = this.pageWidth();
			if (!width || Math.abs(width - this.width) < 2) return;
			this.width = width;
			this.rendered.clear();
			for (const canvas of this.canvases()) {
				const number = Number(canvas.nativeElement.dataset["page"]);
				if (this.visible.has(number)) void this.render(number, canvas.nativeElement);
			}
		}, 200);
	}

	private pageWidth(): number {
		return this.host.nativeElement.querySelector(".page")?.clientWidth ?? this.host.nativeElement.clientWidth;
	}

	private async render(number: number, canvas: HTMLCanvasElement): Promise<void> {
		const document = this.document;
		const width = canvas.clientWidth;
		if (!document || !width || this.rendered.get(number) === width) return;
		this.rendered.set(number, width);
		this.tasks.get(number)?.cancel();

		let page: PDFPageProxy;
		try {
			page = await document.getPage(number);
		} catch {
			return;
		}
		const scale = (width * Math.min(window.devicePixelRatio || 1, 3)) / page.getViewport({ scale: 1 }).width;
		const viewport = page.getViewport({ scale });
		const target = window.document.createElement("canvas");
		target.width = Math.round(viewport.width);
		target.height = Math.round(viewport.height);
		const task = page.render({ canvas: target, viewport });
		this.tasks.set(number, task);
		try {
			await task.promise;
		} catch {
			return;
		} finally {
			if (this.tasks.get(number) === task) this.tasks.delete(number);
		}
		canvas.width = target.width;
		canvas.height = target.height;
		canvas.getContext("2d")?.drawImage(target, 0, 0);
	}
}
