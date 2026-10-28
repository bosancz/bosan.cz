import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	afterNextRender,
	computed,
	inject,
	input,
	linkedSignal,
	signal,
	viewChild,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { Photo } from "../../core/schema";
import { TypographyPipe } from "../../core/typography";

const SWIPE_DISTANCE = 60;
const SLIDE_GAP = 24;
const TAP_SLOP = 10;
const DOUBLE_TAP_TIME = 300;
const DOUBLE_TAP_DISTANCE = 30;
const DOUBLE_TAP_ZOOM = 2.5;
const MAX_ZOOM = 4;

interface Point {
	x: number;
	y: number;
}

interface Zoom {
	scale: number;
	x: number;
	y: number;
}

const NO_ZOOM: Zoom = { scale: 1, x: 0, y: 0 };

function distance(a: Point, b: Point): number {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

function midpoint(a: Point, b: Point): Point {
	return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function clamp(value: number, a: number, b: number): number {
	return Math.min(Math.max(value, Math.min(a, b)), Math.max(a, b));
}

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
	private readonly stage = viewChild.required<ElementRef<HTMLElement>>("stage");

	protected readonly offset = linkedSignal({ source: this.photoId, computation: () => 0 });
	protected readonly zoom = linkedSignal<string, Zoom>({ source: this.photoId, computation: () => NO_ZOOM });
	protected readonly gesturing = signal(false);
	protected readonly zoomed = computed(() => this.zoom().scale > 1);
	protected readonly zoomTransform = computed(() => {
		const { scale, x, y } = this.zoom();
		return `translate(${x}px, ${y}px) scale(${scale})`;
	});

	private readonly pointers = new Map<number, Point>();
	private mode: "swipe" | "pan" | "pinch" | null = null;
	private horizontal = false;
	private moved = false;
	private start: Point = { x: 0, y: 0 };
	private startZoom = NO_ZOOM;
	private startDistance = 1;
	private lastTap: { time: number; point: Point } | null = null;
	private committing: Photo | null = null;

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

	protected readonly slides = computed(() => {
		const photos = this.photos();
		const count = photos.length;
		const index = this.index();
		const slide = (i: number, pos: number) => {
			const photo = photos[(i + count) % count];
			return {
				photo,
				pos,
				size: photo.sizes.big ?? photo.sizes.small!,
				alt: photo.caption || `${this.albumName()}, fotografie ${((i + count) % count) + 1}`,
			};
		};
		const slides = [slide(index, 0)];
		if (count === 2) slides.push(slide(index + 1, this.offset() > 0 ? -1 : 1));
		if (count > 2) slides.push(slide(index - 1, -1), slide(index + 1, 1));
		return slides;
	});

	protected readonly state = { fromAlbum: true };

	constructor() {
		afterNextRender(() => {
			const body = this.document.body;
			const previous = body.style.overflow;
			body.style.overflow = "hidden";
			this.destroyRef.onDestroy(() => (body.style.overflow = previous));
		});
	}

	protected slideTransform(pos: number): string {
		return `translateX(calc(${pos} * (100% + ${SLIDE_GAP}px) + ${this.offset()}px))`;
	}

	protected close(event?: Event): void {
		event?.preventDefault();
		if (history.state?.fromAlbum) history.back();
		else void this.router.navigate(["/jak-jsme-se-meli/album", this.albumId()]);
	}

	protected go(photo: Photo): void {
		void this.router.navigate(["/jak-jsme-se-meli/album", this.albumId(), photo._id], {
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
				if (this.zoomed()) this.zoom.set(NO_ZOOM);
				else this.close();
				break;
			default:
				return;
		}
		event.preventDefault();
	}

	protected onPointerDown(event: PointerEvent): void {
		if (this.committing || (event.pointerType === "mouse" && event.button !== 0)) return;
		this.stage().nativeElement.setPointerCapture(event.pointerId);
		this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
		this.gesturing.set(true);
		if (this.pointers.size === 1) {
			this.moved = false;
			this.beginSingle(event.pointerType === "mouse");
		} else if (this.pointers.size === 2) {
			this.moved = true;
			this.beginPinch();
		}
	}

	protected onPointerMove(event: PointerEvent): void {
		if (!this.pointers.has(event.pointerId)) return;
		const point = { x: event.clientX, y: event.clientY };
		this.pointers.set(event.pointerId, point);

		if (this.mode === "pinch") {
			const [a, b] = [...this.pointers.values()];
			const scale = Math.min(Math.max((this.startZoom.scale * distance(a, b)) / this.startDistance, 1), MAX_ZOOM);
			const center = this.photoCenter();
			const mid = midpoint(a, b);
			const qx = (this.start.x - center.x - this.startZoom.x) / this.startZoom.scale;
			const qy = (this.start.y - center.y - this.startZoom.y) / this.startZoom.scale;
			this.zoom.set({ scale, x: mid.x - center.x - qx * scale, y: mid.y - center.y - qy * scale });
			return;
		}

		const dx = point.x - this.start.x;
		const dy = point.y - this.start.y;
		if (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP) this.moved = true;

		if (this.mode === "pan") {
			this.zoom.set(this.clampZoom({ ...this.startZoom, x: this.startZoom.x + dx, y: this.startZoom.y + dy }));
		} else if (this.mode === "swipe") {
			if (!this.horizontal && Math.abs(dx) > TAP_SLOP && Math.abs(dx) > Math.abs(dy)) this.horizontal = true;
			if (this.horizontal) this.offset.set(dx);
		}
	}

	protected onPointerUp(event: PointerEvent): void {
		if (!this.pointers.delete(event.pointerId)) return;

		if (this.mode === "pinch") {
			if (this.pointers.size > 1) return;
			const zoom = this.zoom();
			this.zoom.set(zoom.scale < 1.05 ? NO_ZOOM : this.clampZoom(zoom));
			if (this.pointers.size === 1) {
				this.beginSingle(event.pointerType === "mouse");
			} else {
				this.mode = null;
				this.gesturing.set(false);
			}
			return;
		}
		if (this.pointers.size) return;

		this.gesturing.set(false);
		const mode = this.mode;
		this.mode = null;

		if (!this.moved && event.type === "pointerup")
			this.onTap({ x: event.clientX, y: event.clientY }, event.timeStamp);

		if (mode === "swipe" && this.horizontal) {
			const dx = this.offset();
			const width = this.stage().nativeElement.clientWidth + SLIDE_GAP;
			if (dx <= -SWIPE_DISTANCE && this.photos().length > 1) this.commit(this.next(), -width);
			else if (dx >= SWIPE_DISTANCE && this.photos().length > 1) this.commit(this.previous(), width);
			else this.offset.set(0);
		}
	}

	protected onTransitionEnd(event: TransitionEvent): void {
		const target = event.target as HTMLElement;
		if (!this.committing || event.propertyName !== "transform" || !target.classList.contains("current")) return;
		const photo = this.committing;
		this.committing = null;
		this.go(photo);
	}

	private beginSingle(mouse: boolean): void {
		const [point] = [...this.pointers.values()];
		this.start = point;
		this.startZoom = this.zoom();
		this.horizontal = false;
		this.mode = this.zoomed() ? "pan" : mouse ? null : "swipe";
	}

	private beginPinch(): void {
		const [a, b] = [...this.pointers.values()];
		this.offset.set(0);
		this.start = midpoint(a, b);
		this.startDistance = Math.max(distance(a, b), 1);
		this.startZoom = this.zoom();
		this.mode = "pinch";
	}

	private commit(photo: Photo, offset: number): void {
		this.committing = photo;
		this.offset.set(offset);
	}

	private onTap(point: Point, time: number): void {
		const last = this.lastTap;
		if (last && time - last.time < DOUBLE_TAP_TIME && distance(point, last.point) < DOUBLE_TAP_DISTANCE) {
			this.lastTap = null;
			this.toggleZoom(point);
		} else {
			this.lastTap = { time, point };
		}
	}

	private toggleZoom(point: Point): void {
		if (this.zoomed()) {
			this.zoom.set(NO_ZOOM);
			return;
		}
		const center = this.photoCenter();
		const scale = DOUBLE_TAP_ZOOM;
		this.zoom.set(
			this.clampZoom({ scale, x: (point.x - center.x) * (1 - scale), y: (point.y - center.y) * (1 - scale) }),
		);
	}

	private currentPhoto(): HTMLElement | null {
		return this.stage().nativeElement.querySelector<HTMLElement>(".slide.current .photo");
	}

	private photoCenter(): Point {
		const photo = this.currentPhoto();
		if (!photo) return { x: 0, y: 0 };
		const slide = photo.parentElement!.getBoundingClientRect();
		return {
			x: slide.left + photo.offsetLeft + photo.offsetWidth / 2,
			y: slide.top + photo.offsetTop + photo.offsetHeight / 2,
		};
	}

	private clampZoom(zoom: Zoom): Zoom {
		const photo = this.currentPhoto();
		if (!photo) return zoom;
		const stage = this.stage().nativeElement.getBoundingClientRect();
		const center = this.photoCenter();
		const halfWidth = (photo.offsetWidth * zoom.scale) / 2;
		const halfHeight = (photo.offsetHeight * zoom.scale) / 2;
		return {
			scale: zoom.scale,
			x: clamp(zoom.x, stage.right - center.x - halfWidth, stage.left - center.x + halfWidth),
			y: clamp(zoom.y, stage.bottom - center.y - halfHeight, stage.top - center.y + halfHeight),
		};
	}
}
