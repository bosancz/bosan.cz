import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { ApiService } from "../../core/api.service";
import { SeoService } from "../../core/seo.service";
import { ProgramEvent } from "../../core/schema";
import { CHILD_GROUPS, GroupInfo, groupInfo } from "../../core/groups";
import { eventTypeIcon } from "../../core/event-types";
import { formatDateRange, formatWeekdayRange, monthKey, monthName, parseDate } from "../../core/dates";

interface MonthSection {
	key: string;
	title: string;
	events: ProgramEvent[];
}

@Component({
	selector: "bo-program-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, NgTemplateOutlet],
	templateUrl: "./program-page.html",
	styleUrl: "./program-page.scss",
})
export class ProgramPage {
	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly route = inject(ActivatedRoute);

	protected readonly program = this.api.program();
	protected readonly icalUrl = this.api.icalUrl();
	protected readonly groups = CHILD_GROUPS;
	protected readonly menuOpen = signal(false);
	protected readonly dateRange = formatDateRange;
	protected readonly weekdays = formatWeekdayRange;
	protected readonly icon = eventTypeIcon;

	protected readonly selected = toSignal(this.route.queryParamMap.pipe(map((params) => params.get("oddil") ?? "")), {
		initialValue: this.route.snapshot.queryParamMap.get("oddil") ?? "",
	});

	protected readonly selectedGroup = computed<GroupInfo | null>(() => {
		const id = this.selected();
		return this.groups.find((group) => group.id === id) ?? null;
	});

	protected readonly sections = computed<MonthSection[]>(() => {
		const id = this.selectedGroup()?.id;
		const events = (this.program.value() ?? [])
			.filter((event) => !id || event.groups.includes(id))
			.sort((a, b) => a.dateFrom.localeCompare(b.dateFrom));
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

	protected readonly firstEventId = computed(() => this.sections()[0]?.events[0]?._id);

	constructor() {
		effect(() => {
			this.seo.set({
				title: "Program akcí",
				description:
					"Program výprav, víkendovek a prázdninových akcí vodáckého oddílu ŠÁN pro děti z Prahy. Vyber si oddíl, najdi sraz a stáhni přihlášku.",
				path: "/program",
				image: "/img/og-default.jpg",
				imageAlt: "ŠÁN – program akcí",
				jsonLd: this.jsonLd(),
			});
		});
	}

	protected groupsOf(event: ProgramEvent): GroupInfo[] {
		return event.groups.map(groupInfo);
	}

	protected leaders(event: ProgramEvent): string {
		return event.leaders.map((leader) => leader.nickname).join(", ");
	}

	protected radius(index: number): string {
		return index % 2 === 0 ? "30px 22px 34px 20px" : "22px 30px 20px 34px";
	}

	protected toggleMenu(): void {
		this.menuOpen.update((open) => !open);
	}

	private jsonLd(): object[] {
		return (this.program.value() ?? []).map((event) => ({
			"@context": "https://schema.org",
			"@type": "Event",
			name: event.name,
			description: event.description ?? undefined,
			startDate: event.dateFrom.slice(0, 10),
			endDate: event.dateTill.slice(0, 10),
			eventStatus:
				event.status === "cancelled"
					? "https://schema.org/EventCancelled"
					: "https://schema.org/EventScheduled",
			eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
			location: {
				"@type": "Place",
				name: event.meeting?.start ?? "Praha",
				address: { "@type": "PostalAddress", addressLocality: "Praha", addressCountry: "CZ" },
			},
			organizer: { "@type": "Organization", name: "KONDOR Skupina ŠÁN z.s.", url: "https://bosan.cz" },
			image: "https://bosan.cz/img/og-default.jpg",
		}));
	}
}
