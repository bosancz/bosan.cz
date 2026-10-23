import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { groupInfo } from "../../core/groups";
import { ORGANIZATION_LD, SeoService } from "../../core/seo.service";
import { VenueMap } from "./venue-map";

interface LeaderContact {
	photo: string;
	nickname: string;
	name: string;
	group: string;
	email: string;
	phone: string;
}

interface BoardMember {
	photo: string;
	nickname: string;
	role: string;
	email: string;
	phone: string;
}

interface Section {
	id: string;
	title: string;
	leaders: LeaderContact[];
}

const ROTATIONS = [-2, 1.5, -1, 2];

@Component({
	selector: "bo-contacts-page",
	imports: [VenueMap],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./contacts-page.html",
	styleUrl: "./contacts-page.scss",
})
export class ContactsPage {
	private readonly seo = inject(SeoService);

	protected readonly sections: Section[] = [
		{
			id: "pondeli",
			title: "schůzky v pondělí",
			leaders: [
				{
					photo: "johanka",
					nickname: "Johanka",
					name: "Johana Štěchová",
					group: "5",
					email: "johanka@bosan.cz",
					phone: "608 929 829",
				},
				{
					photo: "ksilt",
					nickname: "Kšilt",
					name: "Vít Suchomel",
					group: "7",
					email: "ksilt@bosan.cz",
					phone: "792 369 583",
				},
				{
					photo: "cica",
					nickname: "Číča",
					name: "Amálie Peláková",
					group: "8",
					email: "cica@bosan.cz",
					phone: "737 461 023",
				},
				{
					photo: "lef",
					nickname: "Lef",
					name: "Jiří Kubíček",
					group: "22",
					email: "lef@bosan.cz",
					phone: "605 340 502",
				},
			],
		},
		{
			id: "streda",
			title: "schůzky ve středu",
			leaders: [
				{
					photo: "cip",
					nickname: "Čip",
					name: "Kateřina Sazimová",
					group: "3",
					email: "cip@bosan.cz",
					phone: "733 374 326",
				},
				{
					photo: "redkvicka",
					nickname: "Ředkvička",
					name: "Emma Hrdličková",
					group: "4",
					email: "redkvicka@bosan.cz",
					phone: "605 498 958",
				},
				{
					photo: "rammstein",
					nickname: "Rammstein",
					name: "Jana Nováková",
					group: "6",
					email: "rammstein@bosan.cz",
					phone: "605 900 368",
				},
			],
		},
	];

	protected readonly board: BoardMember[] = [
		{ photo: "jara", nickname: "Jára", role: "hlavní vedoucí", email: "jara@bosan.cz", phone: "721 833 194" },
		{ photo: "tycka", nickname: "Tyčka", role: "hospodář", email: "tycka@bosan.cz", phone: "606 939 753" },
		{ photo: "masa", nickname: "Máša", role: "člen vedení", email: "masa@bosan.cz", phone: "732 649 157" },
		{ photo: "fila", nickname: "Fíla", role: "člen vedení", email: "fila@bosan.cz", phone: "774 533 358" },
		{ photo: "sumak", nickname: "Šumák", role: "člen vedení", email: "sumak@bosan.cz", phone: "703 126 142" },
		{ photo: "pasik", nickname: "Pašík", role: "člen vedení", email: "pasik@bosan.cz", phone: "731 651 145" },
		{ photo: "vokurka", nickname: "Vokurka", role: "člen vedení", email: "vokurka@bosan.cz", phone: "725 739 088" },
		{ photo: "mazak", nickname: "Mazák", role: "revizor", email: "mazak@bosan.cz", phone: "731 041 415" },
		{ photo: "zabis", nickname: "Žabiš", role: "mluvčí za KONDOR", email: "zabis@bosan.cz", phone: "777 840 316" },
	];

	constructor() {
		const contactPoints = [
			{
				"@type": "ContactPoint",
				contactType: "general",
				email: "info@bosan.cz",
				availableLanguage: "cs",
			},
			...this.board.slice(0, 1).map((member) => this.contactPoint(member, "hlavní vedoucí")),
			...this.sections.flatMap((section) =>
				section.leaders.map((leader) => this.contactPoint(leader, `oddílový vedoucí, ${leader.group}. oddíl`)),
			),
		];
		this.seo.set({
			title: "Kontakty",
			description:
				"Kontakty na vedení dětské vodácké skupiny ŠÁN a oddílové vedoucí. Schůzky v pondělí a ve středu 16:00–18:00 na loděnici v Praze 4 – Hodkovičkách.",
			path: "/kontakty",
			image: "/img/contacts/foto-johanka.jpg",
			imageAlt: "Oddílová vedoucí Johanka",
			jsonLd: {
				...ORGANIZATION_LD,
				address: {
					"@type": "PostalAddress",
					streetAddress: "V Náklích 445/1a",
					addressLocality: "Praha 4 – Hodkovičky",
					postalCode: "147 00",
					addressCountry: "CZ",
				},
				contactPoint: contactPoints,
			},
		});
	}

	protected group(id: string) {
		return groupInfo(id);
	}

	protected rotation(index: number): string {
		return `${ROTATIONS[index % ROTATIONS.length]}deg`;
	}

	protected tel(phone: string): string {
		return "tel:+420" + phone.replace(/\s/g, "");
	}

	private contactPoint(person: { nickname: string; email: string; phone: string }, contactType: string) {
		return {
			"@type": "ContactPoint",
			name: person.nickname,
			contactType,
			email: person.email,
			telephone: "+420" + person.phone.replace(/\s/g, ""),
			availableLanguage: "cs",
		};
	}
}
