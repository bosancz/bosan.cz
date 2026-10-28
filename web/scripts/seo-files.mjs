import { readFileSync, writeFileSync } from "node:fs";

const configuration = process.argv[2] ?? "production";
const sites = { production: "https://bosan.cz", test: "https://test.bosan.cz" };
const siteUrl = sites[configuration] ?? "http://localhost:4200";
const indexable = configuration === "production";

const dist = new URL("../dist/", import.meta.url);
const { routes } = JSON.parse(readFileSync(new URL("prerendered-routes.json", dist), "utf8"));

const excluded = new Set(["/aktualne", "/404"]);
const priority = (route) => (route === "/" ? "1.0" : route.startsWith("/jak-jsme-se-meli/album/") ? "0.5" : "0.8");
const urls = Object.keys(routes)
	.filter((route) => !excluded.has(route))
	.sort()
	.map(
		(route) =>
			`\t<url><loc>${siteUrl}${route === "/" ? "/" : route}</loc><priority>${priority(route)}</priority></url>`,
	);

writeFileSync(
	new URL("browser/sitemap.xml", dist),
	`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`,
);
writeFileSync(
	new URL("browser/robots.txt", dist),
	indexable ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` : "User-agent: *\nDisallow: /\n",
);
console.log(`sitemap.xml with ${urls.length} URLs for ${siteUrl}`);
