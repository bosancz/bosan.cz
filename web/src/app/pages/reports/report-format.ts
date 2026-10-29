import { PublicReport, ReportChronicle } from "../../core/schema";
import { albumDates } from "../gallery/gallery-dates";

export function reportDates(report: PublicReport): string {
	return `${albumDates(report.dateFrom, report.dateTill)} ${report.dateFrom.slice(0, 4)}`;
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
