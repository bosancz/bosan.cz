import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import opentype from "opentype.js";
import sharp from "sharp";

const apiRoot = "https://interni.bosan.cz/api";
const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO_WIDTH = 760;
const TEXT_LEFT = 800;
const TEXT_WIDTH = 350;
const NAVY = "#2a3478";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/browser/", root);
const read = (path) => readFileSync(new URL(path, root));
const toArrayBuffer = (buffer) => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
const font = (path) => opentype.parse(toArrayBuffer(read(path)));

const display = [font("public/fonts/SanGrotesk-Regular.otf")];
const body900 = [0, 1].map((i) =>
	font(`node_modules/@fontsource/nunito-sans/files/nunito-sans-${i ? "latin-ext" : "latin"}-900-normal.woff`),
);
const body800 = [0, 1].map((i) =>
	font(`node_modules/@fontsource/nunito-sans/files/nunito-sans-${i ? "latin-ext" : "latin"}-800-normal.woff`),
);
const logo = read("public/img/logo.svg");
const waves = read("public/img/news/vlny-yellow.svg");
const fallback = new URL("img/og-default.jpg", dist);

function glyphFont(fonts, char) {
	return fonts.find((f) => f.charToGlyphIndex(char) > 0) ?? fonts[0];
}

function measure(fonts, text, size, spacing = 0) {
	let width = 0;
	for (const char of text) width += glyphFont(fonts, char).getAdvanceWidth(char, size) + spacing;
	return width - (text ? spacing : 0);
}

function textPath(fonts, text, x, y, size, fill, spacing = 0) {
	let d = "";
	for (const char of text) {
		const f = glyphFont(fonts, char);
		d += f.getPath(char, x, y, size).toPathData(2);
		x += f.getAdvanceWidth(char, size) + spacing;
	}
	return `<path d="${d}" fill="${fill}"/>`;
}

function wrap(fonts, text, size, width) {
	const lines = [];
	for (const word of text.split(/\s+/).filter(Boolean)) {
		const last = lines.at(-1);
		if (last !== undefined && measure(fonts, `${last} ${word}`, size) <= width)
			lines[lines.length - 1] = `${last} ${word}`;
		else lines.push(word);
	}
	return lines;
}

function titleLines(name) {
	for (const size of [64, 56, 48, 42]) {
		const lines = wrap(display, name, size, TEXT_WIDTH);
		if (lines.length <= 3 && lines.every((line) => measure(display, line, size) <= TEXT_WIDTH))
			return { size, lines };
	}
	const size = 42;
	const lines = wrap(display, name, size, TEXT_WIDTH).slice(0, 4);
	return { size, lines };
}

function parseDate(value) {
	const [y, m, d] = value.slice(0, 10).split("-").map(Number);
	return new Date(Date.UTC(y, m - 1, d));
}

function albumDates(from, till) {
	const a = parseDate(from);
	const day = (d) => `${d.getUTCDate()}. ${d.getUTCMonth() + 1}.`;
	let range = day(a);
	if (till && till.slice(0, 10) !== from.slice(0, 10)) {
		const b = parseDate(till);
		range =
			a.getUTCMonth() === b.getUTCMonth() && a.getUTCFullYear() === b.getUTCFullYear()
				? `${a.getUTCDate()}.–${day(b)}`
				: `${day(a)} – ${day(b)}`;
	}
	return `${range} ${from.slice(0, 4)}`;
}

function overlay(item) {
	const { size, lines } = titleLines(item.name.trim());
	const lineHeight = size * 0.95;
	const top = 285;
	const title = lines
		.map((line, i) => textPath(display, line, TEXT_LEFT, top + size * 0.78 + i * lineHeight, size, "#e28f26"))
		.join("");
	const label = textPath(body900, item.label, TEXT_LEFT, 268, 20, "#c9cee9", 2.4);
	const dates = textPath(body800, albumDates(item.dateFrom, item.dateTill), TEXT_LEFT + 2, 551, 24, "#ffffff");
	return Buffer.from(
		`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">` +
			`<path d="M760 0 C 680 120, 800 220, 720 330 C 650 430, 780 520, 730 630 L${WIDTH} ${HEIGHT} L${WIDTH} 0 Z" fill="${NAVY}"/>` +
			label +
			title +
			dates +
			`</svg>`,
	);
}

async function render(item, photoUrl) {
	const photo = await fetch(photoUrl).then((res) => {
		if (!res.ok) throw new Error(`${res.status} ${photoUrl}`);
		return res.arrayBuffer();
	});
	const logoImage = await sharp(logo, { density: 300 }).resize({ height: 76 }).png().toBuffer();
	const logoMeta = await sharp(logoImage).metadata();
	const wavesImage = await sharp(waves, { density: 300 }).resize({ width: 110 }).png().toBuffer();
	const wavesMeta = await sharp(wavesImage).metadata();
	return sharp({ create: { width: WIDTH, height: HEIGHT, channels: 3, background: NAVY } })
		.composite([
			{
				input: await sharp(Buffer.from(photo))
					.rotate()
					.resize(PHOTO_WIDTH + 40, HEIGHT, { fit: "cover" })
					.toBuffer(),
				left: 0,
				top: 0,
			},
			{ input: overlay(item), left: 0, top: 0 },
			{ input: logoImage, left: WIDTH - 60 - logoMeta.width, top: 60 },
			{ input: wavesImage, left: WIDTH - 60 - wavesMeta.width, top: HEIGHT - 62 - wavesMeta.height },
		])
		.jpeg({ quality: 82, mozjpeg: true })
		.toBuffer();
}

const getJson = (path) =>
	fetch(`${apiRoot}${path}`).then((res) =>
		res.ok ? res.json() : Promise.reject(new Error(`${res.status} ${path}`)),
	);

function photoUrl(photo) {
	return photo?.sizes?.big?.url ?? photo?.sizes?.small?.url ?? null;
}

async function albumPhoto(album, id) {
	const listed = photoUrl(album?.titlePhotos?.[0]);
	if (listed) return listed;
	const preview = await getJson(`/public/gallery/${id}/preview`).catch(() => null);
	return photoUrl(preview?.titlePhotos?.[0] ?? preview?.previewPhotos?.[0]);
}

async function fetchReports() {
	const reports = [];
	try {
		for (let offset = 0; ; offset += 100) {
			const page = await getJson(`/public/reports?limit=100&offset=${offset}`);
			reports.push(...page);
			if (page.length < 100) return reports;
		}
	} catch {
		return reports;
	}
}

async function main() {
	const { routes } = JSON.parse(readFileSync(new URL("../prerendered-routes.json", dist), "utf8"));
	const routeIds = (prefix) =>
		Object.keys(routes)
			.map((route) => route.match(new RegExp(`^/${prefix}/([^/]+)$`))?.[1])
			.filter(Boolean);
	const albums = new Map((await getJson("/public/gallery")).map((album) => [album._id, album]));
	const reports = new Map((await fetchReports()).map((report) => [report._id, report]));

	const jobs = [
		...routeIds("jak-jsme-se-meli/album").map((id) => ({
			file: `album-${id}.jpg`,
			item: albums.get(id) && { ...albums.get(id), label: "JAK JSME SE MĚLI" },
			photo: () => albumPhoto(albums.get(id), id),
		})),
		...routeIds("jak-jsme-se-meli").map((id) => {
			const report = reports.get(id);
			return {
				file: `report-${id}.jpg`,
				item: report && { ...report, label: "KRONIKA AKCE" },
				photo: async () =>
					report?.album
						? (photoUrl(report.album.titlePhoto) ??
							albumPhoto(albums.get(report.album._id), report.album._id))
						: null,
			};
		}),
	];

	const out = new URL("og/", dist);
	mkdirSync(out, { recursive: true });

	let rendered = 0;
	let failed = 0;
	const queue = [...jobs];
	const worker = async () => {
		for (let job = queue.shift(); job; job = queue.shift()) {
			const file = new URL(job.file, out);
			try {
				const url = job.item ? await job.photo() : null;
				if (!url) {
					copyFileSync(fallback, file);
					continue;
				}
				writeFileSync(file, await render(job.item, url));
				rendered++;
			} catch (error) {
				failed++;
				console.warn(`og image ${job.file}: ${error.message}`);
				copyFileSync(fallback, file);
			}
		}
	};
	await Promise.all(Array.from({ length: 6 }, worker));
	console.log(`og images: ${rendered} rendered, ${jobs.length - rendered} with the default image (${failed} failed)`);
}

await main();
