import {
	ChangeDetectionStrategy,
	Component,
	Injector,
	afterNextRender,
	computed,
	effect,
	inject,
	signal,
} from "@angular/core";
import { DOCUMENT, NgTemplateOutlet } from "@angular/common";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { map } from "rxjs";
import { ApiService } from "../../core/api.service";
import { SeoService } from "../../core/seo.service";
import { ProgramEvent } from "../../core/schema";
import { CHILD_GROUPS, GroupInfo, groupInfo, sortGroupIds } from "../../core/groups";
import { eventTypeIcon } from "../../core/event-types";
import { formatPhone, phoneHref } from "../../core/phone";
import { InlineMarkdownPipe, MarkdownPipe, markdownToText } from "../../core/markdown";
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
	imports: [RouterLink, NgTemplateOutlet, MarkdownPipe, InlineMarkdownPipe, TypographyPipe],
	templateUrl: "./program-page.html",
	styleUrl: "./program-page.scss",
})
export class ProgramPage {
	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly route = inject(ActivatedRoute);
	private readonly document = inject(DOCUMENT);
	private readonly injector = inject(Injector);

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

	private readonly fragment = toSignal(this.route.fragment, { initialValue: this.route.snapshot.fragment });
	private scrolledTo: string | null = null;
	protected readonly targetId = computed(() => {
		const fragment = this.fragment();
		return fragment?.startsWith("akce-") ? fragment.slice(5) : null;
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
					"Program výprav, víkendovek a prázdninových akcí vodáckého oddílu ŠÁN pro děti z Prahy. Vyber si oddíl, najdi sraz a stáhni přihlášku.",
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
			const mobile = leader.contacts?.mobile?.trim();
			return {
				id: leader._id,
				nickname: leader.nickname,
				phone: mobile ? formatPhone(mobile) : null,
				href: mobile ? phoneHref(mobile) : null,
			};
		});
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
				name: markdownToText(event.meeting?.start) || "Praha",
				address: { "@type": "PostalAddress", addressLocality: "Praha", addressCountry: "CZ" },
			},
			organizer: { "@type": "Organization", name: "KONDOR Skupina ŠÁN z.s.", url: "https://bosan.cz" },
			image: "https://bosan.cz/img/og-default.jpg",
		}));
	}
}
