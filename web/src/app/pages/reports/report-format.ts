import { markdownToText } from "../../core/markdown";
import { PublicReport, ReportChronicle } from "../../core/schema";
import { albumDates } from "../gallery/gallery-dates";

export function reportDates(report: PublicReport): string {
	return `${albumDates(report.dateFrom, report.dateTill)} ${report.dateFrom.slice(0, 4)}`;
}

export function reportExcerpt(text: string | null, max: number): string {
	const first = markdownToText((text ?? "").split(/\n\s*\n/)[0]);
	if (first.length <= max) return first;
	const cut = first.slice(0, max);
	return cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)).replace(/[,.;:–-]+$/, "") + "…";
}

export function reportWater(report: PublicReport): string {
	const km = report.waterKm ? `${report.waterKm.toLocaleString("cs-CZ")} km` : "";
	return [report.river?.trim(), km].filter(Boolean).join(" · ");
}

export function chronicleSize(chronicle: ReportChronicle): string {
	const mb = chronicle.size / 1e6;
	if (mb >= 1) return `${mb.toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} MB`;
	return `${Math.max(1, Math.round(chronicle.size / 1e3)).toLocaleString("cs-CZ")} kB`;
}

export function reportPhoto(report: PublicReport, size: "small" | "big"): string | null {
	const sizes = report.album?.titlePhoto?.sizes;
	return (size === "big" ? (sizes?.big ?? sizes?.small) : (sizes?.small ?? sizes?.big))?.url ?? null;
}
