import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	ElementRef,
	ViewEncapsulation,
	afterNextRender,
	inject,
	signal,
	viewChild,
} from "@angular/core";
import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import { environment } from "../../../environments/environment";

interface Place {
	id: string;
	name: string;
	short: string;
	position: LatLngTuple;
	zoom: number;
}

interface EdgeArrow {
	place: Place;
	label: string;
	x: number;
	y: number;
	angle: number;
}

const PLACES: Place[] = [
	{ id: "lodenice", name: "Loděnice, V Náklích 445/1a", short: "Loděnice", position: [50.02395, 14.39831], zoom: 15 },
	{
		id: "sidlo",
		name: "Sídlo spolku, Podolské nábřeží 1180/5",
		short: "Sídlo",
		position: [50.0506, 14.4151],
		zoom: 15,
	},
	{ id: "san", name: "Tábor na ostrově Šán", short: "Ostrov Šán", position: [50.46623, 14.2348], zoom: 14 },
];

const EDGE_INSET = 34;
const LABEL_INSET = 84;
const MERGE_DISTANCE = 110;

@Component({
	selector: "bo-venue-map",
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	templateUrl: "./venue-map.html",
	styleUrl: "./venue-map.scss",
})
export class VenueMap {
	private readonly canvas = viewChild.required<ElementRef<HTMLElement>>("canvas");
	private readonly destroyRef = inject(DestroyRef);
	private map?: LeafletMap;

	protected readonly places = PLACES;
	protected readonly arrows = signal<EdgeArrow[]>([]);

	constructor() {
		afterNextRender(async () => {
			const module = await import("leaflet");
			const L = (module as unknown as { default?: typeof module }).default ?? module;
			const element = this.canvas().nativeElement;
			const home = PLACES[0];
			const map = L.map(element, {
				center: home.position,
				zoom: home.zoom,
				scrollWheelZoom: false,
				attributionControl: false,
			});
			this.map = map;
			this.destroyRef.onDestroy(() => map.remove());

			const tileSize = devicePixelRatio > 1 ? "256@2x" : "256";
			L.tileLayer(
				`https://api.mapy.com/v1/maptiles/outdoor/${tileSize}/{z}/{x}/{y}?apikey=${environment.mapyApiKey}`,
				{ minZoom: 0, maxZoom: 19 },
			).addTo(map);

			L.control
				.attribution({ prefix: false })
				.addAttribution(
					'<a href="https://api.mapy.com/copyright" target="_blank" rel="noopener">&copy; Seznam.cz a.s. a další</a>',
				)
				.addTo(map);

			const Logo = L.Control.extend({
				onAdd: () => {
					const link = L.DomUtil.create("a", "venue-map-logo");
					link.href = "https://mapy.com/";
					link.target = "_blank";
					link.rel = "noopener";
					link.innerHTML =
						'<img src="https://api.mapy.com/img/api/logo.svg" alt="Mapy.com" width="100" height="28" />';
					L.DomEvent.disableClickPropagation(link);
					return link;
				},
			});
			new Logo({ position: "bottomleft" }).addTo(map);

			for (const place of PLACES) {
				L.marker(place.position, {
					title: place.name,
					alt: place.name,
					icon: L.divIcon({
						className: `venue-map-pin venue-map-pin--${place.id}`,
						html: `<span class="venue-map-pin-dot"></span><span class="venue-map-pin-label">${place.short}</span>`,
						iconSize: [0, 0],
					}),
				})
					.bindPopup(place.name)
					.addTo(map);
			}

			map.on("move zoom resize", () => this.updateArrows());
			this.updateArrows();
		});
	}

	protected show(place: Place): void {
		this.map?.flyTo(place.position, place.zoom, { duration: 1.2 });
	}

	private updateArrows(): void {
		const map = this.map;
		if (!map) return;
		const size = map.getSize();
		const cx = size.x / 2;
		const cy = size.y / 2;
		const center = map.getCenter();
		const arrows: EdgeArrow[] = [];
		for (const place of PLACES) {
			const point = map.latLngToContainerPoint(place.position);
			if (point.x >= 0 && point.x <= size.x && point.y >= 0 && point.y <= size.y) continue;
			const dx = point.x - cx;
			const dy = point.y - cy;
			const scale = Math.min(
				dx ? (cx - EDGE_INSET) / Math.abs(dx) : Infinity,
				dy ? (cy - EDGE_INSET) / Math.abs(dy) : Infinity,
			);
			const km = map.distance(center, place.position) / 1000;
			const distance = km < 10 ? `${km.toFixed(1).replace(".", ",")} km` : `${Math.round(km)} km`;
			const x = Math.min(size.x - LABEL_INSET, Math.max(LABEL_INSET, cx + dx * scale));
			const y = cy + dy * scale;
			const near = arrows.find((arrow) => Math.hypot(arrow.x - x, arrow.y - y) < MERGE_DISTANCE);
			if (near) {
				near.label = `${near.label} · ${place.short} ${distance}`;
				continue;
			}
			arrows.push({
				place,
				label: `${place.short} ${distance}`,
				x,
				y,
				angle: (Math.atan2(dy, dx) * 180) / Math.PI,
			});
		}
		this.arrows.set(arrows);
	}
}
