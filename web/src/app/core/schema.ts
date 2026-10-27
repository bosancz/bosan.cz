export interface ApiLink {
	href: string;
	method?: string;
	allowed?: boolean | Record<string, boolean>;
}

export interface Leader {
	_id: string;
	nickname: string;
	contacts?: { mobile?: string; email?: string };
}

export interface ProgramEvent {
	_id: string;
	status: "public" | "cancelled" | string;
	name: string;
	type: string | null;
	description: string | null;
	dateFrom: string;
	dateTill: string;
	timeFrom: string | null;
	timeTill: string | null;
	groups: string[];
	leadersEvent: boolean;
	meeting?: { start?: string | null; end?: string | null };
	leaders: Leader[];
	publishedAt?: string | null;
	cancelledAt?: string | null;
	_links?: { registration?: ApiLink };
}

export interface PhotoSize {
	url: string;
	width: number;
	height: number;
}

export interface Photo {
	_id: string;
	album?: string;
	name?: string;
	caption?: string | null;
	width?: number;
	height?: number;
	bg?: string;
	date?: string;
	sizes: { small?: PhotoSize; big?: PhotoSize; original?: PhotoSize };
}

export interface Album {
	_id: string;
	year: number;
	status: string;
	name: string;
	description: string | null;
	datePublished: string | null;
	dateFrom: string;
	dateTill: string;
	titlePhotos: Photo[];
	previewPhotos?: Photo[];
	photos?: Photo[];
	_links?: { self?: ApiLink; download?: ApiLink };
}

export interface PublicGroupLeader {
	_id: string;
	nickname: string;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	mobile: string | null;
	profilePhoto: string | null;
}

export interface PublicGroup {
	_id: string;
	shortName: string;
	name: string;
	color: string | null;
	darkColor: string | null;
	children: boolean;
	meetingDay: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | null;
	leader: PublicGroupLeader | null;
}

export interface PublicBoardMember extends PublicGroupLeader {
	function: string | null;
}

export interface PublicReport {
	_id: string;
	name: string;
	type: string | null;
	dateFrom: string;
	dateTill: string;
	groups: string[];
	leaders: { nickname: string }[];
	report: string | null;
	reportPublishedAt: string;
	river: string | null;
	waterKm: number | null;
	album: { _id: string; name: string; titlePhoto?: Photo | null } | null;
	chronicle?: ReportChronicle | null;
}

export interface ReportChronicle {
	fileName: string;
	size: number;
	updatedAt: string;
	url: string;
}
