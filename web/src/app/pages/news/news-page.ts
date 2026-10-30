import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ApiService, LiveData } from "../../core/api.service";
import { formatDateRange, formatWeekdayRange, monthName, parseDate } from "../../core/dates";
import { eventTypeIcon } from "../../core/event-types";
import { groupInfo, sortGroupIds } from "../../core/groups";
import { Album, AlbumDetail, ProgramEvent, PublicReport } from "../../core/schema";
import { ORGANIZATION_LD, SITE_NAME, SeoService } from "../../core/seo.service";
import { InlineMarkdownPipe, ParagraphsPipe, markdownToText } from "../../core/markdown";
import { NEWS_CONTENT } from "../../../content/content";
import { TypographyPipe } from "../../core/typography";

const UPCOMING_LIMIT = 7;
const PHOTO_ALBUMS = 5;
const NEWS_DAYS = 45;
const DAY = 86400000;

interface EventCard {
	id: number;
	name: string;
	icon: string;
	iconLabel: string;
	dates: string;
	weekdays: string;
	from: string;
	groups: { id: string; name: string; color: string; text: string }[];
}

interface PhotoTile {
	id: number;
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

function albumYear(album: Album): number {
	return Number(album.dateFrom.slice(0, 4));
}

function albumDates(album: Album): string {
	const from = album.dateFrom.slice(0, 10);
	const till = album.dateTill.slice(0, 10);
	if (albumYear(album) < 2000) return "z archivu";
	const a = parseDate(from);
	const b = parseDate(till);
	const year = a.getUTCFullYear();
	if (b.getTime() - a.getTime() >= 6 * DAY) return `od ${a.getUTCDate()}. ${a.getUTCMonth() + 1}. ${year}`;
	if (year !== b.getUTCFullYear())
		return `${compactRange(from, from)} ${year} – ${compactRange(till, till)} ${b.getUTCFullYear()}`;
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
	const yearFrom = a.getUTCFullYear() !== year ? ` ${a.getUTCFullYear()}` : "";
	return `${a.getUTCDate()}. ${genitive[a.getUTCMonth()]}${yearFrom} – ${b.getUTCDate()}. ${genitive[b.getUTCMonth()]} ${year}`;
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
	imports: [RouterLink, InlineMarkdownPipe, ParagraphsPipe, TypographyPipe],
	templateUrl: "./news-page.html",
	styleUrl: "./news-page.scss",
})
export class NewsPage {
	private readonly api = inject(ApiService);
	private readonly seo = inject(SeoService);
	private readonly program = this.api.program();
	private readonly albums = this.api.recentAlbums(PHOTO_ALBUMS);
	private readonly latest = this.api.latestJournal();
	private readonly leadReport = signal<LiveData<PublicReport> | undefined>(undefined);
	private readonly leadAlbum = signal<LiveData<AlbumDetail> | undefined>(undefined);
	private leadKey?: string;
	private readonly today = isoDay(new Date());

	protected readonly join = NEWS_CONTENT.join;

	protected readonly messages = (NEWS_CONTENT.messages ?? [])
		.filter((message) => message.title && (!message.until || message.until.slice(0, 10) >= this.today))
		.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
		.map((message) => ({
			title: message.title,
			text: message.text,
			date: message.date ? compactRange(message.date.slice(0, 10), message.date.slice(0, 10)) : "",
			from: message.date?.slice(0, 10) ?? "",
		}));

	private readonly events = computed(() => this.program.value() ?? []);

	protected readonly upcoming = computed<EventCard[]>(() =>
		this.events()
			.filter((e) => e.status === "public" && e.dateTill.slice(0, 10) >= this.today)
			.sort((a, b) => a.dateFrom.localeCompare(b.dateFrom))
			.slice(0, UPCOMING_LIMIT)
			.map((e) => ({
				id: e.id,
				name: e.name,
				icon: eventTypeIcon(e.type),
				iconLabel: e.type ?? "schůzka",
				dates: formatDateRange(e.dateFrom, e.dateTill),
				weekdays: formatWeekdayRange(e.dateFrom, e.dateTill),
				from: e.dateFrom,
				groups: sortGroupIds(e.groups).map((id) => groupInfo(id)),
			})),
	);

	protected readonly cancelled = computed(() => {
		const list = this.events()
			.filter((e) => e.status === "cancelled" && e.dateTill.slice(0, 10) >= this.today)
			.sort(
				(a, b) =>
					(b.cancelledAt ?? "").localeCompare(a.cancelledAt ?? "") || a.dateFrom.localeCompare(b.dateFrom),
			);
		return list.map((e) => ({
			id: e.id,
			name: e.name,
			date: formatDateRange(e.dateFrom, e.dateTill),
			groups: e.groups.length ? "oddíl " + sortGroupIds(e.groups).join(", ") : "",
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
			id: e.id,
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
		const item = this.latest.value()?.[0];
		if (!item) return null;
		const url = item.photo?.urls.big;
		return {
			reportId: item.reportId,
			albumId: item.albumId,
			name: item.name.trim(),
			dates: compactRange(item.dateFrom.slice(0, 10), item.dateTill.slice(0, 10)),
			text: item.reportId
				? excerpt(this.leadReport()?.value()?.summary ?? null, 320)
				: markdownToText(this.leadAlbum()?.value()?.description ?? null) ||
					"Podívej se, jak to u nás vypadalo. Fotky z akce jsou v galerii.",
			image: url ?? null,
		};
	});

	protected readonly tiles = computed<PhotoTile[]>(() =>
		this.sortedAlbums().map((album, index) => {
			const photo = album.coverPhoto;
			return {
				id: album.id,
				name: album.name.trim(),
				dates: index === 0 && albumYear(album) >= 2000 ? longAlbumDates(album) : albumDates(album),
				url: photo ? (index === 0 ? photo.urls.big : photo.urls.small) : null,
				bg: photo?.bg ?? "#c9cee9",
			};
		}),
	);

	constructor() {
		effect(() => {
			const item = this.latest.value()?.[0];
			const key = item?.reportId
				? `report-${item.reportId}`
				: item?.albumId
					? `album-${item.albumId}`
					: undefined;
			if (!item || key === this.leadKey) return;
			this.leadKey = key;
			untracked(() => {
				if (item.reportId) this.leadReport.set(this.api.report(item.reportId));
				else if (item.albumId) this.leadAlbum.set(this.api.album(item.albumId));
			});
		});

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
}
