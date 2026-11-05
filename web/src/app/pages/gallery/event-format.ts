import { AlbumChronicle, AlbumEvent } from "../../core/schema";

export function eventWater(event: AlbumEvent): string {
	const km = event.waterKm ? `${event.waterKm.toLocaleString("cs-CZ")} km` : "";
	return [event.river?.trim(), km].filter(Boolean).join(" · ");
}

export function chronicleSize(chronicle: AlbumChronicle): string {
	const mb = chronicle.size / 1e6;
	if (mb >= 1) return `${mb.toLocaleString("cs-CZ", { maximumFractionDigits: 1 })} MB`;
	return `${Math.max(1, Math.round(chronicle.size / 1e3)).toLocaleString("cs-CZ")} kB`;
}
