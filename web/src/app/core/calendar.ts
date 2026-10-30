import { environment } from "../../environments/environment";
import { markdownToText } from "./markdown";
import { ProgramEvent } from "./schema";

const DESCRIPTION_LIMIT = 800;

export interface CalendarEventData {
	uid: string;
	title: string;
	start: string;
	end: string;
	location: string;
	details: string;
	url: string;
}

function isoDay(value: string): string {
	return value.slice(0, 10);
}

function nextDay(value: string): string {
	const [y, m, d] = isoDay(value).split("-").map(Number);
	return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);
}

function compact(day: string): string {
	return day.replaceAll("-", "");
}

export function calendarEventData(event: ProgramEvent): CalendarEventData {
	const url = `${environment.siteUrl}/program#akce-${event.id}`;
	const meetingStart = markdownToText(event.meetingStart);
	const meetingEnd = markdownToText(event.meetingEnd);
	const lines = [
		meetingStart ? `Sraz: ${meetingStart}` : null,
		meetingEnd ? `Návrat: ${meetingEnd}` : null,
		event.leaders.length ? `Vedoucí: ${event.leaders.map((leader) => leader.nickname).join(", ")}` : null,
	].filter((line): line is string => !!line);
	const text = markdownToText(event.description);
	const description = text.length > DESCRIPTION_LIMIT ? text.slice(0, DESCRIPTION_LIMIT).trimEnd() + "…" : text;
	const details = [lines.join("\n"), description, url].filter(Boolean).join("\n\n");
	return {
		uid: `event-${event.id}@bosan.cz`,
		title: event.status === "cancelled" ? `Zrušeno: ${event.name}` : event.name,
		start: isoDay(event.dateFrom),
		end: nextDay(event.dateTill || event.dateFrom),
		location: meetingStart,
		details,
		url,
	};
}

export function googleCalendarUrl(data: CalendarEventData): string {
	const params = new URLSearchParams({
		action: "TEMPLATE",
		text: data.title,
		dates: `${compact(data.start)}/${compact(data.end)}`,
		details: data.details,
		location: data.location,
		ctz: "Europe/Prague",
	});
	return `https://calendar.google.com/calendar/render?${params}`;
}

export function outlookCalendarUrl(data: CalendarEventData, origin = "https://outlook.live.com"): string {
	const params = new URLSearchParams({
		path: "/calendar/action/compose",
		rru: "addevent",
		subject: data.title,
		startdt: data.start,
		enddt: data.end,
		allday: "true",
		body: data.details,
		location: data.location,
	});
	return `${origin}/calendar/0/deeplink/compose?${params}`;
}

function icsText(value: string): string {
	return value.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function foldLine(line: string): string {
	const bytes = new TextEncoder().encode(line);
	if (bytes.length <= 75) return line;
	const parts: string[] = [];
	let current = "";
	let size = 0;
	for (const char of line) {
		const length = new TextEncoder().encode(char).length;
		if (size + length > (parts.length ? 74 : 75)) {
			parts.push(current);
			current = "";
			size = 0;
		}
		current += char;
		size += length;
	}
	parts.push(current);
	return parts.join("\r\n ");
}

export function eventIcs(data: CalendarEventData, now = new Date()): string {
	const stamp = now
		.toISOString()
		.replace(/[-:]/g, "")
		.replace(/\.\d{3}/, "");
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//bosan.cz//web//CS",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		"BEGIN:VEVENT",
		`UID:${data.uid}`,
		`DTSTAMP:${stamp}`,
		`DTSTART;VALUE=DATE:${compact(data.start)}`,
		`DTEND;VALUE=DATE:${compact(data.end)}`,
		`SUMMARY:${icsText(data.title)}`,
		data.location ? `LOCATION:${icsText(data.location)}` : null,
		`DESCRIPTION:${icsText(data.details)}`,
		`URL:${data.url}`,
		"END:VEVENT",
		"END:VCALENDAR",
	].filter((line): line is string => line !== null);
	return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function eventIcsDataUrl(data: CalendarEventData): string {
	return "data:text/calendar;charset=utf-8," + encodeURIComponent(eventIcs(data));
}
