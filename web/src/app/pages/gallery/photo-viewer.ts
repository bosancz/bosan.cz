import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	afterNextRender,
	effect,
	computed,
	inject,
	input,
	signal,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { Photo } from "../../core/schema";
import { TypographyPipe } from "../../core/typography";

const SWIPE_DISTANCE = 60;

@Component({
	selector: "bo-photo-viewer",
	imports: [RouterLink, TypographyPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./photo-viewer.html",
	styleUrl: "./photo-viewer.scss",
	host: {
		"(document:keydown)": "onKey($event)",
	},
})
export class PhotoViewer {
	readonly albumId = input.required<string>();
	readonly albumName = input.required<string>();
	readonly photos = input.required<Photo[]>();
	readonly photoId = input.required<string>();

	private readonly router = inject(Router);
	private readonly document = inject(DOCUMENT);
	private readonly destroyRef = inject(DestroyRef);

	protected readonly dragX = signal(0);
	protected readonly dragging = signal(false);
	private startX = 0;
	private startY = 0;
	private horizontal = false;

	protected readonly index = computed(() =>
		Math.max(
			0,
			this.photos().findIndex((p) => p._id === this.photoId()),
		),
	);
	protected readonly current = computed(() => this.photos()[this.index()]);
	protected readonly previous = computed(
		() => this.photos()[(this.index() - 1 + this.photos().length) % this.photos().length],
	);
	protected readonly next = computed(() => this.photos()[(this.index() + 1) % this.photos().length]);
	protected readonly size = computed(() => this.current().sizes.big ?? this.current().sizes.small!);
	protected readonly alt = computed(
		() => this.current().caption || `${this.albumName()}, fotografie ${this.index() + 1}`,
	);

	protected readonly state = { fromAlbum: true };

	constructor() {
		afterNextRender(() => {
			const body = this.document.body;
			const previous = body.style.overflow;
			body.style.overflow = "hidden";
			this.destroyRef.onDestroy(() => (body.style.overflow = previous));
		});
		effect(() => {
			this.photoId();
			this.preload();
		});
	}

	protected preload(): void {
		for (const photo of [this.previous(), this.next()]) {
			const url = photo?.sizes.big?.url;
			if (url && typeof Image !== "undefined") new Image().src = url;
		}
	}

	protected close(event?: Event): void {
		event?.preventDefault();
		if (history.state?.fromAlbum) history.back();
		else void this.router.navigate(["/fotogalerie", this.albumId()]);
	}

	protected go(photo: Photo): void {
		void this.router.navigate(["/fotogalerie", this.albumId(), photo._id], {
			replaceUrl: true,
			state: this.state,
		});
	}

	protected onKey(event: KeyboardEvent): void {
		switch (event.key) {
			case "ArrowLeft":
				this.go(this.previous());
				break;
			case "ArrowRight":
				this.go(this.next());
				break;
			case "Home":
				this.go(this.photos()[0]);
				break;
			case "End":
				this.go(this.photos()[this.photos().length - 1]);
				break;
			case "Escape":
				this.close();
				break;
			default:
				return;
		}
		event.preventDefault();
	}

	protected onPointerDown(event: PointerEvent): void {
		if (event.pointerType === "mouse") return;
		this.startX = event.clientX;
		this.startY = event.clientY;
		this.horizontal = false;
		this.dragging.set(true);
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	protected onPointerMove(event: PointerEvent): void {
		if (!this.dragging()) return;
		const dx = event.clientX - this.startX;
		const dy = event.clientY - this.startY;
		if (!this.horizontal && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) this.horizontal = true;
		if (this.horizontal) this.dragX.set(dx);
	}

	protected onPointerUp(event: PointerEvent): void {
		if (!this.dragging()) return;
		this.dragging.set(false);
		const dx = this.dragX();
		this.dragX.set(0);
		if (!this.horizontal) return;
		if (dx <= -SWIPE_DISTANCE) this.go(this.next());
		else if (dx >= SWIPE_DISTANCE) this.go(this.previous());
	}
}
