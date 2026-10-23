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

interface Turnus {
	id: string;
	from: string;
	to: string;
	label: string[];
	groups: string[];
	leader: { nickname: string; name: string; email: string; phone: string };
}

interface Photo {
	file: string;
	alt: string;
}

interface Chapter {
	part: string;
	title: string;
	text: string;
	photos: Photo[];
	layout: "single" | "pair" | "trio";
}

interface SpecialDay {
	title: string;
	text: string;
	photo: Photo;
}

interface TocItem {
	id: string;
	label: string;
}

const TURNUSY: Turnus[] = [
	{
		id: "prvni",
		from: "2026-07-04",
		to: "2026-07-24",
		label: ["4. 7. –", "24. 7. 2026"],
		groups: ["3", "4", "8", "22"],
		leader: { nickname: "Pašík", name: "Václav Čechmánek", email: "pasik@bosan.cz", phone: "731 651 145" },
	},
	{
		id: "druhy",
		from: "2026-07-25",
		to: "2026-08-14",
		label: ["25. 7. –", "14. 8. 2026"],
		groups: ["5", "6", "7"],
		leader: { nickname: "Perla", name: "Valentýna Tyllová", email: "perla@bosan.cz", phone: "732 229 605" },
	},
];

const CHAPTERS: Chapter[] = [
	{
		part: "ráno",
		title: "budíček a rozcvička",
		text: "Den na Šánu začíná budíčkem. Ještě rozespalí se všichni seběhneme na rozcvičku, a pak přijde to hlavní: stezka. Kus běhu po ostrově, shyby na hrazdě, házení granátů na terč a šplh po laně. Každý den se dá zkusit překonat svůj včerejší výkon.",
		layout: "trio",
		photos: [
			{ file: "stezka-shyby", alt: "Shyby na hrazdě" },
			{ file: "stezka-granat", alt: "Házení granátem na terč" },
			{ file: "stezka-splh", alt: "Šplh po laně" },
		],
	},
	{
		part: "ráno",
		title: "nástup",
		text: "Po snídani se celý tábor seřadí na nástup v modrých krojových košilích. Vztyčíme vlajku a řekneme si, co nás ten den čeká.",
		layout: "single",
		photos: [{ file: "nastup", alt: "Ranní nástup v krojích" }],
	},
	{
		part: "ráno",
		title: "posádkový závod kolem ánu",
		text: "Pak usednou posádky do svých devítikánoí a závodí kolem sousedního ostrova Án. Je to asi kilometr a vyhrává ta posádka, která pádluje nejvíc společně.",
		layout: "pair",
		photos: [
			{ file: "zavod-posadky", alt: "Posádky nastupují do devítikánoí" },
			{ file: "zavod-an", alt: "Závod kolem Ánu" },
		],
	},
	{
		part: "dopoledne",
		title: "dopolední program",
		text: "Dopoledne se oddíly učí věci, které se na vodě i v přírodě hodí: uzly, zdravovědu a další dovednosti. Jindy si jen hrajeme na vodě na malých lodích, deblovkách a kajacích.",
		layout: "pair",
		photos: [
			{ file: "program-uzly", alt: "Učíme se uzly" },
			{ file: "program-kajak", alt: "Na kajaku" },
		],
	},
	{
		part: "poledne",
		title: "oběd a polední klid",
		text: "Po obědě přichází polední klid. Někdo si odpočine ve stanu, jiný si čte nebo luští ve stínu.",
		layout: "pair",
		photos: [
			{ file: "obed", alt: "Oběd v jídelně" },
			{ file: "poledni-klid", alt: "Polední klid" },
		],
	},
	{
		part: "odpoledne",
		title: "celotáborová hra",
		text: "Odpoledne patří celotáborové hře. Má svůj příběh, který nás provází celým táborem, a posádky v ní soutěží proti sobě na ostrově i na vodě.",
		layout: "pair",
		photos: [
			{ file: "hra-plaz", alt: "Celotáborová hra na pláži" },
			{ file: "hra-vylodeni", alt: "Posádka se chystá k vylodění" },
		],
	},
	{
		part: "večer",
		title: "večeře a večerní nástup",
		text: "Den uzavírá večeře a večerní nástup, na kterém stáhneme vlajku a zhodnotíme, jak se komu dařilo.",
		layout: "single",
		photos: [{ file: "vecerni-nastup", alt: "Stahování vlajky na večerním nástupu" }],
	},
	{
		part: "večer",
		title: "volný čas",
		text: "Zbytek večera má každý pro sebe. Někdo si čte, jiný vyřezává ze dřeva a další hrají s ostatními fotbal.",
		layout: "single",
		photos: [{ file: "volny-cas", alt: "Večerní fotbálek" }],
	},
	{
		part: "noc",
		title: "na dobrou noc",
		text: "Před spaním ještě čteme nebo hrajeme na dobrou noc. Pak už tábor usíná a ostrov ztichne.",
		layout: "single",
		photos: [{ file: "dobrou-noc", alt: "Hraní na dobrou noc" }],
	},
];

const SPECIAL_DAYS: SpecialDay[] = [
	{
		title: "kanál",
		text: "Jeden den vyrážíme na divokovodní kanál. Kdo si troufne, sjíždí peřeje na lodi nebo se nechá unášet vodou v plovací vestě a helmě. Kdo ne, pádluje v klidnější vodě pod ním.",
		photo: { file: "kanal", alt: "Splouvání kanálu" },
	},
	{
		title: "pochod",
		text: "Jiný den opustíme ostrov a vyrazíme na celodenní pochod okolím. Batohy na záda a hurá do lesů.",
		photo: { file: "pochod", alt: "Pochod lesem" },
	},
	{
		title: "hospůdka",
		text: "Ve čtvrtek před koncem tábora otevíráme hospůdku. Role se obrátí: vedoucí v kostýmech obsluhují a děti si u stolů objednávají a platí penězi, které si během tábora vydělaly.",
		photo: { file: "hospudka", alt: "Vedoucí za barem hospůdky" },
	},
	{
		title: "závěrečný táborák",
		text: "Tábor končí v pátek slavnostním táborákem. Přijet mohou i rodiče, oceníme nejlepší a naposledy si spolu zazpíváme.",
		photo: { file: "taborak", alt: "Závěrečný táborák" },
	},
];

const INCLUDED = [
	"doprava autobusem z naší loděnice v Praze",
	"stravování pětkrát denně",
	"ubytování ve stanech s podsadou",
	"zázemí v laminátové jídelně a zděné kuchyni",
	"úrazové pojištění a odborní zdravotníci",
	"hlavní vedoucí certifikovaný MŠMT ČR",
	"možnost příspěvku od zaměstnavatele",
];

const TOC: TocItem[] = [
	{ id: "t-turnusy", label: "tábory" },
	{ id: "t-zivot", label: "táborový život" },
	{ id: "t-den", label: "jeden den na Šánu" },
	{ id: "t-cena", label: "kolik to stojí" },
	{ id: "t-ostrov", label: "kde tábor je" },
];

const DESCRIPTION =
	"Letní vodácký tábor ŠÁN na ostrově na Labi u Roudnice nad Labem: dva turnusy pro děti od 7 do 15 let, devítikánoe, celotáborová hra, cena i den na Šánu.";

@Component({
	selector: "bo-camp-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: "./camp-page.html",
	styleUrl: "./camp-page.scss",
})
export class CampPage {
	private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly destroyRef = inject(DestroyRef);
	private readonly seo = inject(SeoService);

	protected readonly turnusy = TURNUSY;
	protected readonly chapters = CHAPTERS;
	protected readonly specialDays = SPECIAL_DAYS;
	protected readonly included = INCLUDED;
	protected readonly toc = TOC;
	protected readonly activeId = signal(TOC[0].id);
	protected readonly tocOpen = signal(false);

	constructor() {
		this.seo.set({
			title: "Tábor na ostrově Šán",
			description: DESCRIPTION,
			path: "/tabor",
			image: "/img/camp/header.jpg",
			imageAlt: "Tábořiště na ostrově Šán",
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

	protected group(id: string) {
		return groupInfo(id);
	}

	protected activeLabel(): string {
		return this.toc.find((item) => item.id === this.activeId())?.label ?? "";
	}

	protected closeToc(): void {
		this.tocOpen.set(false);
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
			description: DESCRIPTION,
			eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
			eventStatus: "https://schema.org/EventScheduled",
			startDate: TURNUSY[0].from,
			endDate: TURNUSY[TURNUSY.length - 1].to,
			typicalAgeRange: "7-15",
			image: this.seo.absoluteUrl("/img/camp/header.jpg"),
			location: place,
			organizer,
			offers: [
				{
					"@type": "Offer",
					name: "Člen skupiny ŠÁN",
					price: "5100",
					priceCurrency: "CZK",
					url: this.seo.absoluteUrl("/tabor"),
				},
				{
					"@type": "Offer",
					name: "Nečlen",
					price: "5600",
					priceCurrency: "CZK",
					url: this.seo.absoluteUrl("/tabor"),
				},
			],
			subEvent: TURNUSY.map((turnus, index) => ({
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
