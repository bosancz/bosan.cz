import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TypographyPipe } from "../../core/typography";

interface HistoryQuote {
	text: string;
	author: string;
	featured?: boolean;
}

interface HistoryEntry {
	year: string;
	title: string;
	text: string;
	note: string;
	tone: "" | "red" | "green" | "today";
	quotes: HistoryQuote[];
	photos: { src: string; alt: string }[];
}

interface HistoryEra {
	label: string;
	title: string;
	entries: HistoryEntry[];
}

export const HISTORY: HistoryEra[] = [
	{
		label: "1968–1973",
		title: "Od skautů k pionýrům",
		entries: [
			{
				year: "1968",
				title: "Vodní skauti z Dejvic",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Chodili jsme na schůzky do Thalmanovy ul. v Dejvicích, tam byla taky poradní skála za Bubenečským nádražím a podnikaly se nedělní výpravy. To ještě u toho ani nebyl Patron a jako skautský oddíl chlapecký jsme spadali pod Středisko Bílý Los.",
						author: "Tarzan",
					},
					{
						text: "Uplně první klubovna byla v dnešní Verdunské ulici v Praze 6. Byla to sklepní místnost. […] Pak následovala Šlikovka.",
						author: "Vyzvědač",
					},
					{
						text: "Šlikovka, to byla klubovna jak z Foglarových knížek. […] Pamatuji si do dnes na šero zimních odpolední a černo večerů, podivnou a až magickou vůni tohoto domečku, která spojovala vůni vlhkého zdiva a čoudících kamen. Pro mne byla Šlikovka kouskem Stínadel.",
						author: "Igor",
					},
				],
				photos: [],
			},
			{
				year: "1969",
				title: "První tábor na Šánu",
				text: "Na fotkách je album ze 70. let, nejstarší, které ve fotogalerii zatím máme.",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Vše se změnilo až s příchodem Patrona v r. 1969 a hlavně uspořádáním 1. tábora na ostrově pod Roudnicí. Tenkrát asi vznikla většina pojmenování a tradic, jako souostroví Ešán, „čibu“. […] Patron také přinesl do oddílu vodáctví a měli jsme první dvě zteřelé pramičky – Babičku a Tetičku.",
						author: "Tarzan",
					},
					{
						text: "Šán je název ostrova u Roudnice – tento název vznikl obráceným přečtením slova náš, je součástí souostroví Ešan tj naše, kam patří ještě Án a En, který je velký a malý.",
						author: "Pája",
					},
					{
						text: "Pak Patron volil mezi ostrovem na Žernosekách a tímto. Šán se stal Náš.",
						author: "Bejby",
						featured: true,
					},
				],
				photos: [
					{ src: "/img/about/history-1970-a.jpg", alt: "" },
					{ src: "/img/about/history-1970-b.jpg", alt: "" },
					{ src: "/img/about/history-1970-c.jpg", alt: "" },
				],
			},
			{
				year: "1970",
				title: "Ze skautů pionýři",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Stihl jsem ještě na táboře složit skautský slib, ale pak hned v září bohužel došlo díky tehdejší politické situaci ke zrušení Junáka. Patron zareagoval okamžitě a byla založena 90. pionýrská skupina. V zimě jsme už pak začali nosit rudé šátky a modré zůstaly jen jako pracovní.",
						author: "Tarzan",
					},
					{
						text: "Skupina si dlouho zachovává i mnoho původních skautských symbolů. Některé mírně skrytě, jiné hrdě, třeba jako tmavomodrý kroj vodních skautů.",
						author: "Igor",
					},
				],
				photos: [],
			},
			{
				year: "1973",
				title: "Velký nábor",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Patřily jsme do velkého náboru, který Patron udělal v roce 1973, kdy se rozhodl zkusit i dívčí oddíl. […] Pro vodu se tenkrát jezdilo s velkými 25-litrovými hliníkovými bandaskami od mléka – pro dívčí oddíl to byla makačka ty plné bandy dostat do lodě a na Šán.",
						author: "Pája",
					},
					{
						text: "Kopřivy byly dvoumetrové a po topolech jsme šplhali jako po tyči. Kuchyň s jídelnou plátěné, stany s dřevěnou podsadou.",
						author: "Igor",
					},
					{
						text: "Jen si představte – po vodní hladině pluje ladná Isabela a kolem ní se rojí množství malých plavidel. Isabela byla kuchyň, zásobovací loď, bezpečí, jistota.",
						author: "Bejby",
					},
				],
				photos: [],
			},
		],
	},
	{
		label: "70. léta",
		title: "Plovárna, studna a Poseidon",
		entries: [
			{
				year: "70. léta",
				title: "Plovárna jménem Bošán",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Pořízení bývalé Vyšehradské plovárny byla nádhera. Každý oddíl mohl mít svojí klubovnu. Všichni velkou dílnu.",
						author: "Igor",
					},
					{
						text: "Pak se ozvalo vždyť to bude takový BotelŠán, od tohohle už byl kousek k BOŠÁN. V uších to zaznělo a bylo nám jasno, to jméno spojovalo Boat a Šán. […] Boat jsme teda zmiňovat nemohli a pak přišel jednoduchý nápad. Náš objekt.",
						author: "Igor",
					},
				],
				photos: [],
			},
			{
				year: "1976",
				title: "Studna, kuchyně a Hobby",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Pak někdy kolem roku 1976 nebo 77 přišel Hobby (i se synem Ponnym), byl tu Jirka […]. S Jirkou se někdy v roce 1976 začala hloubit studna […] a celý tábor jsme se bavili vyhrabováním písku a zapouštěli skruže, skoro až do 10m. […] Hobby začal na táboře vyrábět amulety a barevné provázky, vymýšlet více her.",
						author: "Želva",
					},
					{
						text: "Nikdy nezapomenu na brigádu v cihelně, kdy se Patron rozhodl o stavbě kuchyně […]. Nikdo nám ovšem neřekl, že budeme celou noc vytahovat ještě horké cihly rovnou z pece na palety, kterých bylo tak asi 12, zkrátka na celou kuchyň.",
						author: "Tarzan",
					},
				],
				photos: [],
			},
			{
				year: "1978",
				title: "První Poseidonky",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Za nápadem stál Hobby s Jirkou. […] Posejdon přinášel oheň, který po celou dobu her hořel. Co se určitě nezměnilo, Posejdon vždy mluvil rybí řečí. […] První Posejdonské hry proběhly v neděli 16. 7. 1978.",
						author: "Igor",
					},
				],
				photos: [],
			},
		],
	},
	{
		label: "80. léta",
		title: "Podolí a devítky",
		entries: [
			{
				year: "1979",
				title: "Loděnice v Podolí",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "V roce 1979, po několika letech bojů Jirky […], jsme získali pozemek a začali kopat základy pro naši novou loděnici v Podolí. Postavil se nový barák, stará loděnice zpod Vyšehradu se rozebrala a postavila na souš.",
						author: "Bejby",
					},
					{
						text: "Na Bošánu byla osmdesátá léta časem úpravy terénu. Vysekávali jsme keře, přesýpali hromady hlíny, rozváželi navážku, kam bylo třeba a nakonec rovnali a překopávali tvrdou jalovou půdu a osívali ji travou. Tehdy vznikla z nasypané skládky špíny naše krásná loděnice.",
						author: "Kidd",
					},
					{ text: "A ze zbytků Vyšehradské plovárny jsou dneska Komplexy.", author: "Igor" },
				],
				photos: [],
			},
			{
				year: "1981",
				title: "Celotáborové hry",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Pod taktovkou Hobbyho jsme vymýšleli náměty her, cestovali časem, doprovázeli Marca Pola, hostili mimozemšťany, luštili klínové písmo. […] Dřevěná bleděmodrá bedna, která s námi léta jezdila na Šán coby skříň, byla rekvizitou první celotáborovky Cestování časem.",
						author: "Bejby",
					},
					{
						text: "81 Oddyseus, 82 Albert, 83 Harant, 84 Klínové písmo, 85 Stroj času, 86 Prašánovci, 87 Řecké báje, 88 Alfaůfani, 90 Marco Polo, 91 Harant, 92 Pětina pro krále, 93 klínové písmo, 94 Stroj času, 95 Alvarez, 96 Poklad černého delfína, 97 Olympiáda.",
						author: "Bejby",
					},
				],
				photos: [],
			},
			{
				year: "1985",
				title: "Devítky",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Když se na Bošánu objevily první devítky, tak jsme z nich byli všichni paf. Byly tak lehký, tak rychlý, tak elegantní. […] První naše bylo zelené Achjo později přejmenované na Cyklon. […] V 1983 byly na táboře ty prvně dvě jmenované, tak nějak na zkoušku a jezdili na tom jen vedoucí. 1984 byly lodě napůl, půlka pramic půl devítek […]. A 1985 byl první tábor čistě s devítkama a taky byl poprvé na devítkách i puťák.",
						author: "Žluťák",
					},
					{
						text: "To bylo překvapení pro vedoucí, kteří vždy pramice doprovázeli na kánoích. Na devítky prostě neměli, děti jim ujížděly.",
						author: "Bejby",
					},
				],
				photos: [],
			},
		],
	},
	{
		label: "90. léta",
		title: "Kondor a srazy",
		entries: [
			{
				year: "1990",
				title: "Kondor",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Taky to byla doba, kdy jsme museli volit, jakou cestou se naše skupina vydá po rozpadu pionýrské organizace. Přesto že tu byly i myšlenky na začlenění do skautské organizace, myslím že zvítězila ta nejlepší volba, vstup do Kondora, která akcentuje svébytnost a výjimečnost naší skupiny. […] Devadesátá léta jsou takovou dobou rozletu.",
						author: "Kidd",
					},
				],
				photos: [],
			},
			{
				year: "1996",
				title: "Hron 96",
				text: "Nejstarší barevné album: výprava na slovenský Hron. O dva roky později přibývá album z tábora 98.",
				note: "",
				tone: "",
				quotes: [],
				photos: [
					{ src: "/img/about/hron-1996.jpg", alt: "Skupinová fotka z Hronu 1996" },
					{ src: "/img/about/tabor-1998.jpg", alt: "Děti na lodi, tábor 1998" },
				],
			},
			{
				year: "1999",
				title: "30 let na Šánu",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Sobotní ráno zastihlo všechny přítomné v plném nadšení, a přijela jich téměř stovka, na slavnostním nástupu k zahájení dne. Následovalo spontánní rozdělení do posádek, kdy každé 1 až 2 lodě zastupovaly přibližně jedno desetiletí v historii skupiny.",
						author: "Igor",
					},
				],
				photos: [],
			},
		],
	},
	{
		label: "2002–dnes",
		title: "Povodně a návraty",
		entries: [
			{
				year: "2002",
				title: "Šán po záplavě",
				text: "",
				note: "",
				tone: "red",
				quotes: [
					{
						text: "Velká voda v roce 2002 mnohé vzala. Vlastně skoro vše. Kuchyň spadla, lamináty jídelny se omotaly okolo stromů, mnohé stromy byly podemlety, po opadnutí vody jsme měli z ostrova písečnou pláž.",
						author: "Bejby",
					},
				],
				photos: [
					{ src: "/img/about/flood-2002-river.jpg", alt: "Labe u ostrova po povodni" },
					{ src: "/img/about/flood-2002-ruins.jpg", alt: "Trosky staveb po povodni" },
				],
			},
			{
				year: "2003",
				title: "Stavby na Šánu opět stojí",
				text: "",
				note: "",
				tone: "green",
				quotes: [
					{
						text: "Velký Čibu-čibu zapálil znovu ohýnky v srdcích Šánovců. Celý podzim se uklízelo, zasypávali díry a plánovalo. Celé jaro budovalo. 1. turnus 2003 je na Šánu.",
						author: "Igor",
					},
					{
						text: "Ale duch Šánu to nevzdal. A mládí překvapilo. S vervou se pustilo do obnovy Šánu.",
						author: "Bejby",
					},
				],
				photos: [
					{ src: "/img/about/rebuild-2003-spring.jpg", alt: "Stavba budovy na ostrově, jaro 2003" },
					{ src: "/img/about/rebuild-2003-august.jpg", alt: "Opravené stavby na tábořišti, srpen 2003" },
				],
			},
			{
				year: "2009",
				title: "40 let na Šánu",
				text: "",
				note: "",
				tone: "",
				quotes: [
					{
						text: "Nebylo to vzpomínání na něco dávno zmizelého. Prostě jsem přijel na Šán a hrál si a bavil se jako před x lety.",
						author: "Kidd",
						featured: true,
					},
				],
				photos: [],
			},
			{
				year: "2013",
				title: "Povodeň podruhé",
				text: "První turnus nakonec tábořil na louce na Smrkovci u Jindřichova Hradce, druhý už na Šánu, jen bez jídelny.",
				note: "",
				tone: "red",
				quotes: [
					{
						text: "Stalo se v červnu 2013. Najednou před námi stojí stejné úkoly jako před jedenácti lety. Jsem však rád, že Šánovci se zase s chutí chopí práce. I když poprvé od roku 1969 budou letní tábory jinde než na ostrově, věřím v tábory 2014 opět na našem Šánu.",
						author: "Igor",
					},
				],
				photos: [],
			},
			{
				year: "2017",
				title: "Stěhování do Hodkoviček",
				text: "Tady jsme dodnes.",
				note: "Doplnit.",
				tone: "",
				quotes: [],
				photos: [],
			},
			{
				year: "dnes",
				title: "584 alb ve fotogalerii",
				text: "",
				note: "",
				tone: "today",
				quotes: [],
				photos: [],
			},
		],
	},
];

@Component({
	selector: "bo-about-history",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [TypographyPipe],
	templateUrl: "./about-history.html",
	styleUrl: "./about-history.scss",
})
export class AboutHistory {
	protected readonly eras = HISTORY;

	protected cardQuotes(entry: HistoryEntry): HistoryQuote[] {
		return entry.quotes.filter((quote) => !quote.featured);
	}

	protected featuredQuote(entry: HistoryEntry): HistoryQuote | undefined {
		return entry.quotes.find((quote) => quote.featured);
	}
}
