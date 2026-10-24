import aboutJson from "./o-nas.json";
import campJson from "./tabor.json";
import contactsJson from "./kontakty.json";
import newsJson from "./aktualne.json";

export interface ContentPhoto {
	src: string;
	alt: string;
}

export interface Seo {
	description: string;
}

export interface AboutContent {
	seo: Seo;
	hero: { lead: string; sub: string; photo: ContentPhoto };
	island: { text: string; photo: ContentPhoto };
	groups: { text: string };
}

export interface CampSession {
	from: string;
	to: string;
	groups: string[];
	leader: { nickname: string; name: string; email: string; phone: string };
}

export interface CampChapter {
	part: string;
	title: string;
	text: string;
	photos: ContentPhoto[];
}

export interface CampSpecialDay {
	title: string;
	text: string;
	photo: ContentPhoto;
}

export interface CampContent {
	seo: Seo;
	hero: { lead: string; photo: ContentPhoto };
	sessions: { lead: string; items: CampSession[] };
	life: { text: string; photos: ContentPhoto[] };
	day: { lead: string; chapters: CampChapter[] };
	specialDays: CampSpecialDay[];
	price: { members: number; nonMembers: number; note: string; included: string[] };
	location: { text: string };
}

export interface ContactsContent {
	governance: string;
	hours: string;
}

export interface NewsMessage {
	title: string;
	text: string;
	date: string;
	until: string | null;
}

export interface NewsContent {
	messages: NewsMessage[];
	join: { title: string; long: string; short: string };
}

export const ABOUT_CONTENT = aboutJson as AboutContent;
export const CAMP_CONTENT = campJson as CampContent;
export const CONTACTS_CONTENT = contactsJson as ContactsContent;
export const NEWS_CONTENT = newsJson as NewsContent;
