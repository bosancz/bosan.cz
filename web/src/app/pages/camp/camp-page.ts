import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	afterNextRender,
	inject,
	signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { SeoService } from "../../core/seo.service";
import { groupInfo } from "../../core/groups";
import { InlineMarkdownPipe, ParagraphsPipe } from "../../core/markdown";
import { CAMP_CONTENT, CampChapter } from "../../../content/content";

interface SessionView {
	id: string;
	from: string;
	to: string;
	label: [string, string];
	groups: string[];
	leader: { nickname: string; name: string; email: string; phone: string };
}

const CHAPTER_LAYOUTS = ["single", "single", "pair", "trio"] as const;

function dayMonth(date: string): string {
	const [, month, day] = date.split("-").map(Number);
	return `${day}. ${month}.`;
}

function sessionView(session: (typeof CAMP_CONTENT.sessions.items)[number], index: number): SessionView {
	return {
		id: `turnus-${index + 1}`,
		from: session.from,
		to: session.to,
		label: [`${dayMonth(session.from)} –`, `${dayMonth(session.to)} ${session.to.slice(0, 4)}`],
		groups: session.groups,
		leader: session.leader,
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
	{ id: "t-turnusy", label: "tábory" },
	{ id: "t-zivot", label: "táborový život" },
	{ id: "t-den", label: "jeden den na Šánu" },
	{ id: "t-cena", label: "kolik to stojí" },
	{ id: "t-ostrov", label: "kde tábor je" },
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
	private readonly destroyRef = inject(DestroyRef);
	private readonly seo = inject(SeoService);

	protected readonly content = CAMP_CONTENT;
	protected readonly sessions = CAMP_CONTENT.sessions.items.map(sessionView);
	protected readonly prices = {
		members: price(CAMP_CONTENT.price.members),
		nonMembers: price(CAMP_CONTENT.price.nonMembers),
	};
	protected readonly toc = TOC;
	protected readonly activeId = signal(TOC[0].id);
	protected readonly tocOpen = signal(false);

	constructor() {
		this.seo.set({
			title: "Tábor na ostrově Šán",
			description: CAMP_CONTENT.seo.description,
			path: "/tabor",
			image: CAMP_CONTENT.hero.photo.src,
			imageAlt: CAMP_CONTENT.hero.photo.alt,
			jsonLd: this.jsonLd(),
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
		const target = id ? this.host.nativeElement.querySelector<HTMLElement>("#" + id) : null;
		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
			this.activeId.set(target.id);
		} else window.scrollTo({ top: 0, behavior: "smooth" });
	}

	protected toggleToc(event: Event): void {
		this.tocOpen.set((event.target as HTMLDetailsElement).open);
	}

	private jsonLd(): object {
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
			startDate: this.sessions[0]?.from,
			endDate: this.sessions[this.sessions.length - 1]?.to,
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
			subEvent: this.sessions.map((turnus, index) => ({
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
