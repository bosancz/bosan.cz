import { ChangeDetectionStrategy, Component, ElementRef, computed, input, signal, viewChild } from "@angular/core";

const CALENDAR_NAME = "Bošán – program akcí";

@Component({
	selector: "bo-calendar-subscribe-dialog",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./calendar-subscribe-dialog.html",
	styleUrl: "./calendar-subscribe-dialog.scss",
})
export class CalendarSubscribeDialog {
	readonly url = input.required<string>();

	private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog");
	private readonly urlInput = viewChild.required<ElementRef<HTMLInputElement>>("urlInput");

	protected readonly copied = signal(false);
	private copiedTimeout?: ReturnType<typeof setTimeout>;

	protected readonly webcalUrl = computed(() => this.url().replace(/^https?:\/\//, "webcal://"));
	protected readonly googleUrl = computed(
		() => `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(this.webcalUrl())}`,
	);
	protected readonly outlookUrl = computed(() => this.outlookAddUrl("https://outlook.live.com"));
	protected readonly office365Url = computed(() => this.outlookAddUrl("https://outlook.office.com"));

	open(event?: Event): void {
		event?.preventDefault();
		this.copied.set(false);
		this.dialog().nativeElement.showModal();
	}

	protected close(): void {
		this.dialog().nativeElement.close();
	}

	protected onDialogClick(event: MouseEvent): void {
		if (event.target === this.dialog().nativeElement) this.close();
	}

	protected async copy(): Promise<void> {
		const input = this.urlInput().nativeElement;
		try {
			await navigator.clipboard.writeText(this.url());
		} catch {
			input.select();
			if (!document.execCommand("copy")) return;
		}
		this.copied.set(true);
		clearTimeout(this.copiedTimeout);
		this.copiedTimeout = setTimeout(() => this.copied.set(false), 2500);
	}

	protected selectUrl(event: Event): void {
		(event.target as HTMLInputElement).select();
	}

	private outlookAddUrl(origin: string): string {
		const params = new URLSearchParams({ url: this.webcalUrl(), name: CALENDAR_NAME });
		return `${origin}/calendar/0/addfromweb?${params}`;
	}
}
