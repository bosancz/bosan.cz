import { parseDate } from "../../core/dates";

export function albumDates(from: string, till?: string | null): string {
	const a = parseDate(from);
	const day = (d: Date) => `${d.getUTCDate()}. ${d.getUTCMonth() + 1}.`;
	if (!till || till.slice(0, 10) === from.slice(0, 10)) return day(a);
	const b = parseDate(till);
	if (a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear()) {
		return `${a.getUTCDate()}.–${day(b)}`;
	}
	return `${day(a)} – ${day(b)}`;
}

export function albumName(name: string): string {
	return name.trim();
}

export function photoCount(count: number): string {
	if (count === 1) return "1 fotografie";
	if (count >= 2 && count <= 4) return `${count} fotografie`;
	return `${count} fotografií`;
}
