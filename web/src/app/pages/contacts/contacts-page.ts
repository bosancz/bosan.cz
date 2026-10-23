import { ChangeDetectionStrategy, Component, computed, effect, inject } from "@angular/core";
import { ApiService } from "../../core/api.service";
import { PublicGroup } from "../../core/schema";
import { groupInfo } from "../../core/groups";
import { ORGANIZATION_LD, SeoService } from "../../core/seo.service";
import { VenueMap } from "./venue-map";

interface LeaderContact {
	photo: string;
	nickname: string;
	name: string;
	group: string;
	email: string | null;
	phone: string | null;
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
	day: NonNullable<PublicGroup["meetingDay"]>;
	title: string;
	leaders: LeaderContact[];
}

const DAYS: Pick<Section, "id" | "day" | "title">[] = [
	{ id: "pondeli", day: "monday", title: "schůzky v pondělí" },
	{ id: "utery", day: "tuesday", title: "schůzky v úterý" },
	{ id: "streda", day: "wednesday", title: "schůzky ve středu" },
	{ id: "ctvrtek", day: "thursday", title: "schůzky ve čtvrtek" },
	{ id: "patek", day: "friday", title: "schůzky v pátek" },
];

const DEFAULT_PHOTO = "/img/contacts/leader-placeholder.svg";

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

	private readonly groups = inject(ApiService).groups();

	protected readonly sections = computed<Section[]>(() => {
		const groups = (this.groups.value() ?? [])
			.filter((group) => group.children && group.meetingDay && group.leader)
			.sort((a, b) => Number(a.shortName) - Number(b.shortName) || a.shortName.localeCompare(b.shortName));
		return DAYS.map((day) => ({
			...day,
			leaders: groups.filter((group) => group.meetingDay === day.day).map((group) => this.leaderContact(group)),
		})).filter((section) => section.leaders.length);
	});

	protected readonly loadFailed = computed(() => !!this.groups.error() && !this.groups.value());

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
		effect(() => this.setSeo(this.sections()));
	}

	private setSeo(sections: Section[]): void {
		const contactPoints = [
			{
				"@type": "ContactPoint",
				contactType: "general",
				email: "info@bosan.cz",
				availableLanguage: "cs",
			},
			...this.board.slice(0, 1).map((member) => this.contactPoint(member, "hlavní vedoucí")),
			...sections.flatMap((section) =>
				section.leaders.map((leader) => this.contactPoint(leader, `oddílový vedoucí, ${leader.group}. oddíl`)),
			),
		];
		this.seo.set({
			title: "Kontakty",
			description:
				"Kontakty na vedení dětské vodácké skupiny ŠÁN a oddílové vedoucí. Schůzky v pondělí a ve středu 16:00–18:00 na loděnici v Praze 4 – Hodkovičkách.",
			path: "/kontakty",
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

	private leaderContact(group: PublicGroup): LeaderContact {
		const leader = group.leader!;
		return {
			photo: leader.profilePhoto ?? DEFAULT_PHOTO,
			nickname: leader.nickname,
			name: [leader.firstName, leader.lastName].filter(Boolean).join(" "),
			group: group.shortName,
			email: leader.email || null,
			phone: leader.mobile ? this.formatPhone(leader.mobile) : null,
		};
	}

	private formatPhone(phone: string): string {
		const digits = phone.replace(/\D/g, "").replace(/^(00)?420(?=\d{9}$)/, "");
		return digits.length === 9 ? digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") : phone.trim();
	}

	protected photoError(event: Event): void {
		const image = event.target as HTMLImageElement;
		if (!image.src.endsWith(DEFAULT_PHOTO)) image.src = DEFAULT_PHOTO;
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

	private contactPoint(
		person: { nickname: string; email: string | null; phone: string | null },
		contactType: string,
	) {
		return {
			"@type": "ContactPoint",
			name: person.nickname,
			contactType,
			...(person.email ? { email: person.email } : {}),
			...(person.phone ? { telephone: "+420" + person.phone.replace(/\s/g, "") } : {}),
			availableLanguage: "cs",
		};
	}
}
