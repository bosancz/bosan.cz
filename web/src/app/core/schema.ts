export interface ProgramLeader {
	id: number;
	nickname: string;
	mobile: string | null;
}

export interface ProgramEvent {
	id: number;
	status: "public" | "cancelled" | string;
	name: string;
	type: string | null;
	description: string | null;
	dateFrom: string;
	dateTill: string;
	timeFrom: string | null;
	timeTill: string | null;
	meetingStart: string | null;
	meetingEnd: string | null;
	publishedAt: string | null;
	cancelledAt: string | null;
	groups: string[];
	leadersEvent: boolean;
	leaders: ProgramLeader[];
	registrationUrl: string | null;
}

export interface Photo {
	id: number;
	width: number | null;
	height: number | null;
	bg: string | null;
	urls: { small: string; big: string; original: string };
}

export interface AlbumPhoto extends Photo {
	caption: string | null;
	takenAt: string;
}

export interface Album {
	id: number;
	name: string;
	dateFrom: string;
	dateTill: string;
	publishedAt: string | null;
	coverPhoto: Photo | null;
}

export interface AlbumDetail extends Album {
	description: string | null;
	downloadUrl: string;
}

export interface JournalItem {
	reportId: number | null;
	albumId: number | null;
	name: string;
	dateFrom: string;
	dateTill: string;
	publishedAt: string | null;
	summary: boolean;
	chronicle: boolean;
	photo: Photo | null;
}

export interface PublicGroupLeader {
	id: number;
	nickname: string;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	mobile: string | null;
	profilePhotoUrl: string | null;
}

export interface PublicGroup {
	id: number;
	shortName: string;
	name: string;
	color: string | null;
	darkColor: string | null;
	children: boolean;
	meetingDay: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | null;
	leader: PublicGroupLeader | null;
}

export interface PublicBoardMember {
	memberId: number;
	function: string | null;
	nickname: string;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
	mobile: string | null;
	profilePhotoUrl: string | null;
}

export interface PublicReport {
	id: number;
	name: string;
	type: string | null;
	dateFrom: string;
	dateTill: string;
	groups: string[];
	leadersEvent: boolean;
	leaders: { id: number; nickname: string }[];
	summary: string | null;
	publishedAt: string;
	river: string | null;
	waterKm: number | null;
	chronicle: ReportChronicle | null;
	albumId: number | null;
}

export interface ReportChronicle {
	fileName: string;
	size: number;
	updatedAt: string;
	url: string;
}
