import { PublicReport, ReportChronicle } from "../../core/schema";
import { albumDatesWithYear } from "../gallery/gallery-dates";

export function reportDates(report: PublicReport): string {
	return albumDatesWithYear(report.dateFrom, report.dateTill);
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
