import { ChangeDetectionStrategy, Component, DOCUMENT, afterNextRender, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ORGANIZATION_LD, SeoService } from "../../core/seo.service";
import { CHILD_GROUPS, FRIENDS_CLUB } from "../../core/groups";

interface TimelinePhoto {
	src: string;
	alt: string;
	width: number;
	height: number;
}

interface TimelineItem {
	year: string;
	title: string;
	text: string;
	note?: string;
	tone?: "red" | "green" | "today";
	photos: TimelinePhoto[];
}

const IMG = "/img/about/";

const TIMELINE: TimelineItem[] = [
	{
		year: "1969",
		title: "Začátky skupiny",
		text: "Začínali jsme v roce 1969 jako vodní skauti s loděnicí v Praze 6, později jsme byli pionýři. Na vodu jezdíme bez přestávky až do dneška. Na fotkách je album ze 70. let, nejstarší, které ve fotogalerii zatím máme.",
		note: "[Doplnit: kdo skupinu založil a odkud je jméno ŠÁN.]",
		photos: [
			{ src: IMG + "history-1970-a.jpg", alt: "", width: 600, height: 433 },
			{ src: IMG + "history-1970-b.jpg", alt: "", width: 472, height: 340 },
			{ src: IMG + "history-1970-c.jpg", alt: "", width: 472, height: 340 },
		],
	},
	{
		year: "1985",
		title: "Stěhování pod Vyšehrad",
		text: "Loděnice na plovoucích pontonech pod Vyšehradem.",
		photos: [],
	},
	{ year: "1990", title: "Nezávislí", text: "Od roku 1990 jsme nezávislá skupina.", photos: [] },
	{
		year: "1996",
		title: "Hron 96",
		text: "Nejstarší barevné album: výprava na slovenský Hron. O dva roky později přibývá album z tábora 98.",
		photos: [
			{ src: IMG + "hron-1996.jpg", alt: "Skupinová fotka z Hronu 1996", width: 800, height: 640 },
			{ src: IMG + "tabor-1998.jpg", alt: "Děti na lodi, tábor 1998", width: 800, height: 640 },
		],
	},
	{
		year: "2002",
		title: "Šán po záplavě",
		text: "V srpnu 2002 zasáhla povodeň Prahu i ostrov. Fotky z konce srpna ukazují tábořiště zanesené pískem a rozbité stavby.",
		tone: "red",
		photos: [
			{ src: IMG + "flood-2002-river.jpg", alt: "Labe u ostrova po povodni", width: 800, height: 600 },
			{ src: IMG + "flood-2002-ruins.jpg", alt: "Trosky staveb po povodni", width: 453, height: 340 },
		],
	},
	{
		year: "2003",
		title: "Stavby na Šánu opět stojí",
		text: "Na jaře se na ostrově stavělo, v srpnu už se tam zase konaly dva tábory.",
		note: "[Doplnit: kdo stavěl a jak dlouho to trvalo.]",
		tone: "green",
		photos: [
			{
				src: IMG + "rebuild-2003-spring.jpg",
				alt: "Stavba budovy na ostrově, jaro 2003",
				width: 800,
				height: 600,
			},
			{
				src: IMG + "rebuild-2003-august.jpg",
				alt: "Opravené stavby na tábořišti, srpen 2003",
				width: 453,
				height: 340,
			},
		],
	},
	{
		year: "2004",
		title: "Sraz bývalých Šánovců",
		text: "V prosinci se znovu sešli ti, kdo na Šán jezdili dřív.",
		photos: [{ src: IMG + "reunion-2004.jpg", alt: "Bývalí Šánovci v klubovně, 2004", width: 453, height: 340 }],
	},
	{ year: "2006", title: "Stěhování k Racku", text: "Nová loděnice vedle botelu Racek.", photos: [] },
	{ year: "2017", title: "Stěhování do Hodkoviček", text: "Tady jsme dodnes.", photos: [] },
	{
		year: "dnes",
		title: "584 alb ve fotogalerii",
		text: "Sedm oddílů — 3., 4., 5., 6., 7., 8. a 22. — a každý rok dva tábory na ostrově. Doufáme, že se jednou vrátíme do loděnice mezi botelem Racek a novým Dvoreckým mostem.",
		tone: "today",
		photos: [],
	},
];

const SECTIONS = [
	{ id: "o-hist", label: "z historie" },
	{ id: "o-ostrov", label: "ostrov Šán" },
	{ id: "o-oddily", label: "oddíly" },
];

@Component({
	selector: "bo-about-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: "./about-page.html",
	styleUrl: "./about-page.scss",
})
export class AboutPage {
	private readonly document = inject(DOCUMENT);

	protected readonly timeline = TIMELINE;
	protected readonly sections = SECTIONS;
	protected readonly groups = CHILD_GROUPS;
	protected readonly friends = FRIENDS_CLUB;
	protected readonly active = signal(SECTIONS[0].id);
	protected readonly tocOpen = signal(false);

	constructor() {
		inject(SeoService).set({
			title: "O nás",
			description:
				"Dětská vodácká skupina ŠÁN: sedm oddílů pro kluky a holky od 7 do 15 let, na vodu jezdíme od roku 1969 a každé léto táboříme na ostrově Šán na Labi.",
			path: "/o-nas",
			image: "/img/about/hero-group.jpg",
			imageAlt: "Skupinová fotka dětí a vedoucích na kopci",
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "AboutPage",
				name: "O nás",
				url: "https://bosan.cz/o-nas",
				mainEntity: ORGANIZATION_LD,
			},
		});

		afterNextRender(() => {
			const view = this.document.defaultView;
			if (!view || !("IntersectionObserver" in view)) return;
			const visible = new Set<string>();
			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) visible.add(entry.target.id);
						else visible.delete(entry.target.id);
					}
					const current = SECTIONS.find((section) => visible.has(section.id));
					if (current) this.active.set(current.id);
				},
				{ rootMargin: "-90px 0px -55% 0px" },
			);
			for (const section of SECTIONS) {
				const element = this.document.getElementById(section.id);
				if (element) observer.observe(element);
			}
		});
	}

	protected go(event: Event, id: string | null): void {
		event.preventDefault();
		this.tocOpen.set(false);
		const target = id ? this.document.getElementById(id) : null;
		const view = this.document.defaultView;
		if (!view) return;
		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
			if (id) this.active.set(id);
		} else view.scrollTo({ top: 0, behavior: "smooth" });
	}

	protected activeLabel(): string {
		return SECTIONS.find((section) => section.id === this.active())?.label ?? "";
	}
}
