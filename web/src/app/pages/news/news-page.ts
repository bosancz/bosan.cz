import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiService } from "../../core/api.service";
import { formatDateRange, formatWeekdayRange, monthName, parseDate } from "../../core/dates";
import { eventTypeIcon } from "../../core/event-types";
import { groupInfo } from "../../core/groups";
import { Album, ProgramEvent } from "../../core/schema";
import { ORGANIZATION_LD, SITE_NAME, SeoService } from "../../core/seo.service";
import { markdownToText } from "../../core/markdown";

const UPCOMING_LIMIT = 7;
const PHOTO_ALBUMS = 5;
const NEWS_DAYS = 45;
const DAY = 86400000;

interface EventCard {
	id: string;
	name: string;
	icon: string;
	iconLabel: string;
	dates: string;
	weekdays: string;
	from: string;
	groups: { id: string; name: string; color: string; text: string }[];
}

interface PhotoTile {
	id: string;
	name: string;
	dates: string;
	url: string | null;
	bg: string;
}

function isoDay(date: Date): string {
	return date.toISOString().slice(0, 10);
}

function compactRange(from: string, till: string): string {
	const a = parseDate(from);
	const b = parseDate(till);
	const dm = (d: Date) => `${d.getUTCDate()}. ${d.getUTCMonth() + 1}.`;
	if (from === till) return dm(a);
	if (a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear())
		return `${a.getUTCDate()}.–${dm(b)}`;
	return `${dm(a)}–${dm(b)}`;
}

function albumDates(album: Album): string {
	const from = album.dateFrom.slice(0, 10);
	const till = album.dateTill.slice(0, 10);
	if (album.year < 2000) return "z archivu";
	const a = parseDate(from);
	const b = parseDate(till);
	const year = a.getUTCFullYear();
	if (b.getTime() - a.getTime() >= 6 * DAY) return `od ${a.getUTCDate()}. ${a.getUTCMonth() + 1}. ${year}`;
	return `${compactRange(from, till)} ${year}`;
}

function longAlbumDates(album: Album): string {
	const a = parseDate(album.dateFrom);
	const b = parseDate(album.dateTill);
	const genitive = [
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
	const year = b.getUTCFullYear();
	if (album.dateFrom.slice(0, 10) === album.dateTill.slice(0, 10))
		return `${a.getUTCDate()}. ${genitive[a.getUTCMonth()]} ${year}`;
	if (a.getUTCMonth() === b.getUTCMonth())
		return `${a.getUTCDate()}.–${b.getUTCDate()}. ${genitive[b.getUTCMonth()]} ${year}`;
	return `${a.getUTCDate()}. ${genitive[a.getUTCMonth()]} – ${b.getUTCDate()}. ${genitive[b.getUTCMonth()]} ${year}`;
}

function excerpt(text: string | null, max: number): string {
	const first = markdownToText((text ?? "").split(/\n\s*\n/)[0]);
	if (first.length <= max) return first;
	const cut = first.slice(0, max);
	return cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)).replace(/[,.;:–-]+$/, "") + "…";
}

@Component({
	selector: "bo-news-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink],
	templateUrl: "./news-page.html",
	styleUrl: "./news-page.scss",
})
export class NewsPage {
	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly program = this.api.program();
	private readonly albums = this.api.recentAlbums(PHOTO_ALBUMS);
	private readonly today = isoDay(new Date());

	private readonly events = computed(() => this.program.value() ?? []);

	protected readonly upcoming = computed<EventCard[]>(() =>
		this.events()
			.filter((e) => e.status === "public" && e.dateTill.slice(0, 10) >= this.today)
			.sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
			.slice(0, UPCOMING_LIMIT)
			.map((e) => ({
				id: e._id,
				name: e.name,
				icon: eventTypeIcon(e.type),
				iconLabel: e.type ?? "schůzka",
				dates: formatDateRange(e.dateFrom, e.dateTill),
				weekdays: formatWeekdayRange(e.dateFrom, e.dateTill),
				from: e.dateFrom,
				groups: e.groups.map((id) => groupInfo(id)),
			})),
	);

	protected readonly cancelled = computed(() => {
		const list = this.events()
			.filter((e) => e.status === "cancelled" && e.dateTill.slice(0, 10) >= this.today)
			.sort(
				(a, b) =>
					(b.cancelledAt ?? "").localeCompare(a.cancelledAt ?? "") || a.dateFrom.localeCompare(b.dateFrom),
			);
		return list.slice(0, 2).map((e) => ({
			id: e._id,
			name: e.name,
			date: formatDateRange(e.dateFrom, e.dateTill),
			groups: e.groups.length ? "oddíl " + e.groups.join(", ") : "",
		}));
	});

	protected readonly published = computed(() => {
		const events = this.events().filter((e) => e.status === "public" && e.dateTill.slice(0, 10) >= this.today);
		const limit = Date.now() - NEWS_DAYS * DAY;
		const fresh = events
			.filter((e) => e.publishedAt && new Date(e.publishedAt).getTime() >= limit)
			.sort((a, b) => b.publishedAt!.localeCompare(a.publishedAt!));
		const fallback = [...events].sort((a, b) => b.dateFrom.localeCompare(a.dateFrom));
		const pick: ProgramEvent[] = fresh.length ? fresh : fallback;
		return pick.slice(0, 1).map((e) => ({
			id: e._id,
			name: e.name,
			icon: "/img/news/taborak-red.svg",
			dates: compactRange(e.dateFrom.slice(0, 10), e.dateTill.slice(0, 10)),
			text: excerpt(e.description, 150),
		}));
	});

	private readonly sortedAlbums = computed(() =>
		[...(this.albums.value() ?? [])].sort((a, b) => b.dateFrom.localeCompare(a.dateFrom)),
	);

	protected readonly lead = computed(() => {
		const album = this.sortedAlbums().find((a) => a.year >= 2000);
		if (!album) return null;
		const photo = album.titlePhotos[0];
		return {
			id: album._id,
			name: album.name.trim(),
			dates: compactRange(album.dateFrom.slice(0, 10), album.dateTill.slice(0, 10)),
			text:
				markdownToText(album.description) || "Podívej se, jak to u nás vypadalo. Fotky z akce jsou v galerii.",
			image: photo ? this.big(photo.sizes.big?.url ?? photo.sizes.small?.url ?? "") : null,
		};
	});

	protected readonly tiles = computed<PhotoTile[]>(() =>
		this.sortedAlbums().map((album, index) => {
			const photo = album.titlePhotos[0];
			const url = photo?.sizes.big?.url ?? photo?.sizes.small?.url ?? null;
			return {
				id: album._id,
				name: album.name.trim(),
				dates: index === 0 && album.year >= 2000 ? longAlbumDates(album) : albumDates(album),
				url: url ? (index === 0 ? this.big(url) : url) : null,
				bg: photo?.bg ?? "#c9cee9",
			};
		}),
	);

	constructor() {
		this.seo.set({
			title: SITE_NAME,
			description:
				"Sedm dětských vodáckých oddílů z Prahy pro kluky a holky od 7 do 15 let: schůzky v Podolí, víkendové výpravy, vodácké akce a letní tábor na ostrově Šán.",
			path: "/",
			image: "/img/og-default.jpg",
			imageAlt: "Dětská vodácká skupina ŠÁN",
			jsonLd: [
				ORGANIZATION_LD,
				{
					"@context": "https://schema.org",
					"@type": "WebSite",
					name: "Dětská vodácká skupina ŠÁN",
					url: "https://bosan.cz",
					inLanguage: "cs",
				},
			],
		});
	}

	protected month(value: string): string {
		return monthName(value);
	}

	private big(url: string): string {
		return url.replace(/\/small$/, "/big");
	}
}
