import {
	ChangeDetectionStrategy,
	Component,
	DOCUMENT,
	DestroyRef,
	ElementRef,
	Injector,
	afterNextRender,
	computed,
	effect,
	inject,
	signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { SeoService } from "../../core/seo.service";
import { groupInfo, sortGroupIds } from "../../core/groups";
import { goToSection } from "../../core/page-sections";
import { InlineMarkdownPipe, ParagraphsPipe } from "../../core/markdown";
import { CAMP_CONTENT, CampChapter } from "../../../content/content";
import { ApiService } from "../../core/api.service";
import { formatPhone, phoneHref } from "../../core/phone";
import { PublicCamp, PublicCampHistoryYear } from "../../core/schema";

interface SessionView {
	id: string;
	from: string;
	to: string;
	label: string;
	groups: string[];
	leader: { nickname: string; name: string; email: string | null; phone: string | null } | null;
}

interface HistoryYear {
	year: number;
	camps: {
		id: number;
		label: string;
		dates: string;
		detail: string | null;
		leader: string | null;
		albumId: number | null;
	}[];
}

const CHAPTER_LAYOUTS = ["single", "single", "pair", "trio"] as const;
const SESSION_MIN_DAYS = 7;

function dayMonth(date: string): string {
	const [, month, day] = date.split("-").map(Number);
	return `${day}.\u00a0${month}.`;
}

function dateRange(from: string, till: string): string {
	return from === till ? dayMonth(from) : `${dayMonth(from)} – ${dayMonth(till)}`;
}

function days(camp: PublicCamp): number {
	return (Date.parse(camp.dateTill) - Date.parse(camp.dateFrom)) / 86_400_000 + 1;
}

function sessionView(camp: PublicCamp, index: number): SessionView {
	const leader = camp.leader;
	return {
		id: `turnus-${index + 1}`,
		from: camp.dateFrom,
		to: camp.dateTill,
		label: `${dayMonth(camp.dateFrom)} – ${dayMonth(camp.dateTill)}\u00a0${camp.dateTill.slice(0, 4)}`,
		groups: sortGroupIds(camp.groups),
		leader: leader
			? {
					nickname: leader.nickname,
					name: [leader.firstName, leader.lastName].filter(Boolean).join(" "),
					email: leader.email,
					phone: leader.mobile ? formatPhone(leader.mobile) : null,
				}
			: null,
	};
}

function historyYear(item: PublicCampHistoryYear): HistoryYear {
	const camps = [...item.camps].sort(
		(a, b) => Number(a.kind === "putak") - Number(b.kind === "putak") || a.dateFrom.localeCompare(b.dateFrom),
	);
	return {
		year: item.year,
		camps: camps.map((camp) => ({
			id: camp.id,
			label: camp.kind === "putak" ? "Puťák" : "Tábor",
			dates: dateRange(camp.dateFrom, camp.dateTill),
			detail: camp.kind === "putak" ? camp.river : camp.theme,
			leader: camp.leader,
			albumId: camp.albumId,
		})),
	};
}

function price(value: number): string {
	return `${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Kč`;
}

interface TocItem {
	id: string;
	label: string;
}

const TOC: TocItem[] = [
	{ id: "tabory", label: "tábory" },
	{ id: "taborovy-zivot", label: "táborový život" },
	{ id: "jeden-den-na-sanu", label: "jeden den na Šánu" },
	{ id: "kolik-to-stoji", label: "kolik to stojí" },
	{ id: "kde-tabor-je", label: "kde tábor je" },
	{ id: "historie-taboru", label: "historie táborů" },
];

@Component({
	selector: "bo-camp-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ParagraphsPipe, InlineMarkdownPipe],
	templateUrl: "./camp-page.html",
	styleUrl: "./camp-page.scss",
})
export class CampPage {
	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly document = inject(DOCUMENT);
	private readonly injector = inject(Injector);
	private readonly destroyRef = inject(DestroyRef);
	private readonly seo = inject(SeoService);
	private readonly camps = inject(ApiService).camps();
	private readonly history = inject(ApiService).campsHistory();

	protected readonly content = CAMP_CONTENT;
	protected readonly sessions = computed(() =>
		(this.camps.value() ?? [])
			.filter((camp) => camp.kind === "tabor" && days(camp) >= SESSION_MIN_DAYS)
			.sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
			.map(sessionView),
	);
	protected readonly historyYears = computed(() => (this.history.value() ?? []).map(historyYear));
	protected readonly prices = {
		members: price(CAMP_CONTENT.price.members),
		nonMembers: price(CAMP_CONTENT.price.nonMembers),
	};
	protected readonly toc = TOC;
	protected readonly activeId = signal(TOC[0].id);
	protected readonly tocOpen = signal(false);

	constructor() {
		effect(() => {
			this.seo.set({
				title: "Tábor na ostrově Šán",
				description: CAMP_CONTENT.seo.description,
				path: "/tabor",
				image: CAMP_CONTENT.hero.photo.src,
				imageAlt: CAMP_CONTENT.hero.photo.alt,
				jsonLd: this.jsonLd(this.sessions()),
			});
		});

		afterNextRender(() => {
			const update = () => {
				const offset = window.innerHeight * 0.35;
				let current = TOC[0].id;
				for (const item of TOC) {
					const element = this.host.nativeElement.querySelector<HTMLElement>("#" + item.id);
					if (element && element.getBoundingClientRect().top <= offset) current = item.id;
				}
				this.activeId.set(current);
			};
			update();
			window.addEventListener("scroll", update, { passive: true });
			window.addEventListener("resize", update, { passive: true });
			this.destroyRef.onDestroy(() => {
				window.removeEventListener("scroll", update);
				window.removeEventListener("resize", update);
			});
		});
	}

	protected chapterLayout(chapter: CampChapter): string {
		return CHAPTER_LAYOUTS[Math.min(chapter.photos.length, 3)];
	}

	protected group(id: string) {
		return groupInfo(id);
	}

	protected activeLabel(): string {
		return this.toc.find((item) => item.id === this.activeId())?.label ?? "";
	}

	protected go(event: Event, id: string | null): void {
		event.preventDefault();
		this.tocOpen.set(false);
		afterNextRender(() => goToSection(this.document, id), { injector: this.injector });
		if (id) this.activeId.set(id);
	}

	protected toggleToc(event: Event): void {
		this.tocOpen.set((event.target as HTMLDetailsElement).open);
	}

	protected tel(phone: string): string {
		return phoneHref(phone);
	}

	private jsonLd(sessions: SessionView[]): object {
		const place = {
			"@type": "Place",
			name: "LVT ostrov Šán",
			description: "Ostrov na 805. říčním kilometru Labe, asi kilometr dlouhý a 60 metrů široký.",
			address: {
				"@type": "PostalAddress",
				streetAddress: "LVT ostrov Šán, Hrobce",
				addressLocality: "Hrobce u Roudnice nad Labem",
				postalCode: "411 83",
				addressCountry: "CZ",
			},
		};
		const organizer = {
			"@type": "Organization",
			name: "KONDOR Skupina ŠÁN z.s.",
			email: "info@bosan.cz",
		};
		return {
			"@context": "https://schema.org",
			"@type": "Event",
			name: "Letní vodácký tábor na ostrově Šán",
			description: CAMP_CONTENT.seo.description,
			eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
			eventStatus: "https://schema.org/EventScheduled",
			startDate: sessions[0]?.from,
			endDate: sessions[sessions.length - 1]?.to,
			typicalAgeRange: "7-15",
			image: this.seo.absoluteUrl(CAMP_CONTENT.hero.photo.src),
			location: place,
			organizer,
			offers: [
				{
					"@type": "Offer",
					name: "Člen skupiny ŠÁN",
					price: String(CAMP_CONTENT.price.members),
					priceCurrency: "CZK",
					url: this.seo.absoluteUrl("/tabor"),
				},
				{
					"@type": "Offer",
					name: "Nečlen",
					price: String(CAMP_CONTENT.price.nonMembers),
					priceCurrency: "CZK",
					url: this.seo.absoluteUrl("/tabor"),
				},
			],
			subEvent: sessions.map((turnus, index) => ({
				"@type": "Event",
				name: `Tábor na ostrově Šán, ${index + 1}. turnus`,
				startDate: turnus.from,
				endDate: turnus.to,
				eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
				location: place,
				organizer,
			})),
		};
	}
}
