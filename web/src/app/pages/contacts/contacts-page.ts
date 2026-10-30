import { ChangeDetectionStrategy, Component, computed, effect, inject } from "@angular/core";
import { ApiService } from "../../core/api.service";
import { PublicGroup } from "../../core/schema";
import { groupInfo } from "../../core/groups";
import { ORGANIZATION_LD, SeoService } from "../../core/seo.service";
import { VenueMap } from "./venue-map";
import { InlineMarkdownPipe } from "../../core/markdown";
import { CONTACTS_CONTENT } from "../../../content/content";
import { formatPhone } from "../../core/phone";

interface LeaderContact {
	photo: string;
	nickname: string;
	name: string;
	group: string;
	email: string | null;
	phone: string | null;
}

interface BoardMember {
	id: number;
	photo: string;
	nickname: string;
	name: string;
	role: string;
	email: string | null;
	phone: string | null;
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
	imports: [VenueMap, InlineMarkdownPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: "./contacts-page.html",
	styleUrl: "./contacts-page.scss",
})
export class ContactsPage {
	private readonly seo = inject(SeoService);

	protected readonly content = CONTACTS_CONTENT;

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

	private readonly boardMembers = inject(ApiService).boardMembers();

	protected readonly board = computed<BoardMember[]>(() =>
		(this.boardMembers.value() ?? []).map((member) => ({
			id: member.memberId,
			photo: member.profilePhotoUrl ?? DEFAULT_PHOTO,
			nickname: member.nickname,
			name: [member.firstName, member.lastName].filter(Boolean).join(" "),
			role: member.function ?? "člen vedení",
			email: member.email || null,
			phone: member.mobile ? formatPhone(member.mobile) : null,
		})),
	);

	constructor() {
		effect(() => this.setSeo(this.sections(), this.board()));
	}

	private setSeo(sections: Section[], board: BoardMember[]): void {
		const contactPoints = [
			{
				"@type": "ContactPoint",
				contactType: "general",
				email: "info@bosan.cz",
				availableLanguage: "cs",
			},
			...board.slice(0, 1).map((member) => this.contactPoint(member, member.role)),
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
			photo: leader.profilePhotoUrl ?? DEFAULT_PHOTO,
			nickname: leader.nickname,
			name: [leader.firstName, leader.lastName].filter(Boolean).join(" "),
			group: group.shortName,
			email: leader.email || null,
			phone: leader.mobile ? formatPhone(leader.mobile) : null,
		};
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
