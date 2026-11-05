import { ChangeDetectionStrategy, Component, Injector, afterNextRender, computed, effect, inject } from "@angular/core";
import { DOCUMENT, NgTemplateOutlet } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { AccountService } from "../../core/account.service";
import { ApiService } from "../../core/api.service";
import { SeoService } from "../../core/seo.service";
import { ProgramEvent } from "../../core/schema";
import { GroupInfo, groupInfo, sortGroupIds } from "../../core/groups";
import { eventTypeIcon } from "../../core/event-types";
import { formatPhone, phoneHref } from "../../core/phone";
import { InlineMarkdownPipe, MarkdownPipe, markdownToText } from "../../core/markdown";
import { CalendarSubscribeDialog } from "./calendar-subscribe-dialog";
import { AddToCalendar } from "./add-to-calendar";
import { formatDateRange, formatWeekdayRange, monthKey, monthName, parseDate } from "../../core/dates";
import { TypographyPipe } from "../../core/typography";

interface MonthSection {
	key: string;
	title: string;
	events: ProgramEvent[];
}

@Component({
	selector: "bo-program-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		NgTemplateOutlet,
		MarkdownPipe,
		InlineMarkdownPipe,
		TypographyPipe,
		CalendarSubscribeDialog,
		AddToCalendar,
	],
	templateUrl: "./program-page.html",
	styleUrl: "./program-page.scss",
})
export class ProgramPage {
	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly route = inject(ActivatedRoute);
	private readonly document = inject(DOCUMENT);
	private readonly injector = inject(Injector);
	protected readonly account = inject(AccountService);

	protected readonly program = this.api.program();
	protected readonly icalUrl = this.api.icalUrl();
	protected readonly dateRange = formatDateRange;
	protected readonly weekdays = formatWeekdayRange;
	protected readonly icon = eventTypeIcon;

	protected readonly sections = computed<MonthSection[]>(() => {
		const events = [...(this.program.value() ?? [])].sort((a, b) => a.dateFrom.localeCompare(b.dateFrom));
		const sections: MonthSection[] = [];
		for (const event of events) {
			const key = monthKey(event.dateFrom);
			let section = sections.at(-1);
			if (section?.key !== key) {
				section = { key, title: monthName(event.dateFrom), events: [] };
				sections.push(section);
			}
			section.events.push(event);
		}
		return sections;
	});

	protected readonly firstEventId = computed(() => this.sections()[0]?.events[0]?.id);

	private readonly fragment = toSignal(this.route.fragment, { initialValue: this.route.snapshot.fragment });
	private scrolledTo: number | null = null;
	protected readonly targetId = computed(() => {
		const fragment = this.fragment();
		return fragment?.startsWith("akce-") ? Number(fragment.slice(5)) : null;
	});

	constructor() {
		effect(() => {
			const id = this.targetId();
			if (!id || id === this.scrolledTo || !this.sections().length) return;
			this.scrolledTo = id;
			afterNextRender(
				() => {
					const card = Array.from(this.document.querySelectorAll<HTMLElement>(`[data-event="${id}"]`)).find(
						(element) => element.offsetParent !== null,
					);
					card?.scrollIntoView({ block: "center" });
				},
				{ injector: this.injector },
			);
		});

		effect(() => {
			this.seo.set({
				title: "Program akcí",
				description:
					"Program výprav, víkendovek a prázdninových akcí vodáckého oddílu ŠÁN pro děti z Prahy. Najdi sraz a stáhni přihlášku.",
				path: "/program",
				image: "/img/og-default.jpg",
				imageAlt: "ŠÁN – program akcí",
				jsonLd: this.jsonLd(),
			});
		});
	}

	protected groupsOf(event: ProgramEvent): GroupInfo[] {
		return sortGroupIds(event.groups).map(groupInfo);
	}

	protected leadersOf(event: ProgramEvent) {
		return event.leaders.map((leader) => {
			const mobile = leader.mobile?.trim();
			return {
				id: leader.id,
				nickname: leader.nickname,
				phone: mobile ? formatPhone(mobile) : null,
				href: mobile ? phoneHref(mobile) : null,
			};
		});
	}

	protected radius(index: number): string {
		return index % 2 === 0 ? "30px 22px 34px 20px" : "22px 30px 20px 34px";
	}

	private jsonLd(): object[] {
		return (this.program.value() ?? []).map((event) => ({
			"@context": "https://schema.org",
			"@type": "Event",
			name: event.name,
			description: markdownToText(event.description) || undefined,
			startDate: event.dateFrom.slice(0, 10),
			endDate: event.dateTill.slice(0, 10),
			eventStatus:
				event.status === "cancelled"
					? "https://schema.org/EventCancelled"
					: "https://schema.org/EventScheduled",
			eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
			location: {
				"@type": "Place",
				name: event.meetingStart ?? "Praha",
				address: { "@type": "PostalAddress", addressLocality: "Praha", addressCountry: "CZ" },
			},
			organizer: { "@type": "Organization", name: "KONDOR Skupina ŠÁN z.s.", url: "https://bosan.cz" },
			image: "https://bosan.cz/img/og-default.jpg",
		}));
	}
}
