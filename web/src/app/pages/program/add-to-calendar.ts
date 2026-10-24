import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, signal } from "@angular/core";
import { ProgramEvent } from "../../core/schema";
import { calendarEventData, eventIcsDataUrl, googleCalendarUrl, outlookCalendarUrl } from "../../core/calendar";

@Component({
	selector: "bo-add-to-calendar",
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./add-to-calendar.html",
	styleUrl: "./add-to-calendar.scss",
	host: {
		"(document:click)": "onDocumentClick($event)",
		"(document:keydown.escape)": "open.set(false)",
	},
})
export class AddToCalendar {
	readonly event = input.required<ProgramEvent>();

	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

	protected readonly open = signal(false);
	protected readonly data = computed(() => calendarEventData(this.event()));
	protected readonly googleUrl = computed(() => googleCalendarUrl(this.data()));
	protected readonly outlookUrl = computed(() => outlookCalendarUrl(this.data()));
	protected readonly office365Url = computed(() => outlookCalendarUrl(this.data(), "https://outlook.office.com"));
	protected readonly fileName = computed(
		() =>
			(this.event()
				.name.normalize("NFD")
				.replace(/[̀-ͯ]/g, "")
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "") || "akce") + ".ics",
	);

	protected toggle(): void {
		this.open.update((open) => !open);
	}

	protected downloadIcs(event: MouseEvent): void {
		(event.currentTarget as HTMLAnchorElement).href = eventIcsDataUrl(this.data());
		this.open.set(false);
	}

	protected onDocumentClick(event: MouseEvent): void {
		if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.open.set(false);
	}
}
