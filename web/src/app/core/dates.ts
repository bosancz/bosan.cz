const WEEKDAYS = ["ne", "po", "út", "st", "čt", "pá", "so"];
const MONTHS = [
	"leden",
	"únor",
	"březen",
	"duben",
	"květen",
	"červen",
	"červenec",
	"srpen",
	"září",
	"říjen",
	"listopad",
	"prosinec",
];
const MONTHS_GENITIVE = [
	"ledna",
	"února",
	"března",
	"dubna",
	"května",
	"června",
	"července",
	"srpna",
	"září",
	"října",
	"listopadu",
	"prosince",
];

export function parseDate(value: string): Date {
	const [y, m, d] = value.slice(0, 10).split("-").map(Number);
	return new Date(Date.UTC(y, m - 1, d));
}

function dayMonth(date: Date): string {
	return `${date.getUTCDate()}. ${date.getUTCMonth() + 1}.`;
}

export function formatDateRange(from: string, till?: string | null): string {
	const a = parseDate(from);
	if (!till || till.slice(0, 10) === from.slice(0, 10)) return dayMonth(a);
	const b = parseDate(till);
	const yearSuffix = a.getUTCFullYear() !== b.getUTCFullYear() ? ` ${b.getUTCFullYear()}` : "";
	return `${dayMonth(a)} – ${dayMonth(b)}${yearSuffix}`;
}

export function formatWeekdayRange(from: string, till?: string | null): string {
	const a = WEEKDAYS[parseDate(from).getUTCDay()];
	if (!till || till.slice(0, 10) === from.slice(0, 10)) return a;
	return `${a} – ${WEEKDAYS[parseDate(till).getUTCDay()]}`;
}

export function formatLongDate(value: string): string {
	const date = parseDate(value);
	return `${date.getUTCDate()}. ${MONTHS_GENITIVE[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function monthName(value: string): string {
	return MONTHS[parseDate(value).getUTCMonth()];
}

export function monthKey(value: string): string {
	return value.slice(0, 7);
}
