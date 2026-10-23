import { DOCUMENT } from "@angular/common";
import { Injectable, inject } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { environment } from "../../environments/environment";

export interface PageSeo {
	title: string;
	description: string;
	path: string;
	image?: string;
	imageAlt?: string;
	type?: "website" | "article";
	jsonLd?: object | object[];
	noindex?: boolean;
}

export const SITE_NAME = "Dětská vodácká skupina ŠÁN";
export const DEFAULT_IMAGE = "/img/og-default.jpg";
const DEFAULT_IMAGE_SIZE = { width: 1200, height: 630 };

@Injectable({ providedIn: "root" })
export class SeoService {
	private readonly title = inject(Title);
	private readonly meta = inject(Meta);
	private readonly document = inject(DOCUMENT);

	absoluteUrl(path: string): string {
		if (/^https?:\/\//.test(path)) return path;
		return environment.siteUrl + (path.startsWith("/") ? path : "/" + path);
	}

	set(page: PageSeo): void {
		const fullTitle = page.title === SITE_NAME ? SITE_NAME : `${page.title} | ŠÁN`;
		const url = this.absoluteUrl(page.path);
		const image = this.absoluteUrl(page.image ?? DEFAULT_IMAGE);
		const robots = environment.indexable && !page.noindex ? "index, follow" : "noindex, nofollow";

		this.title.setTitle(fullTitle);
		this.tag("name", "description", page.description);
		this.tag("name", "robots", robots);
		this.tag("property", "og:site_name", SITE_NAME);
		this.tag("property", "og:locale", "cs_CZ");
		this.tag("property", "og:type", page.type ?? "website");
		this.tag("property", "og:title", page.title);
		this.tag("property", "og:description", page.description);
		this.tag("property", "og:url", url);
		this.tag("property", "og:image", image);
		this.tag("property", "og:image:alt", page.imageAlt ?? page.title);
		this.imageSize((page.image ?? DEFAULT_IMAGE) === DEFAULT_IMAGE ? DEFAULT_IMAGE_SIZE : null);
		this.tag("name", "twitter:card", "summary_large_image");
		this.tag("name", "twitter:title", page.title);
		this.tag("name", "twitter:description", page.description);
		this.tag("name", "twitter:image", image);
		this.canonical(url);
		this.jsonLd(page.jsonLd);
		this.hoist();
	}

	private imageSize(size: { width: number; height: number } | null): void {
		if (size) {
			this.tag("property", "og:image:width", String(size.width));
			this.tag("property", "og:image:height", String(size.height));
		} else {
			this.meta.removeTag('property="og:image:width"');
			this.meta.removeTag('property="og:image:height"');
		}
	}

	private hoist(): void {
		const head = this.document.head;
		const anchor = head.querySelector("title");
		if (!anchor) return;
		const tags = head.querySelectorAll(
			'meta[name="description"], meta[name="robots"], meta[property^="og:"], meta[name^="twitter:"], link[rel="canonical"]',
		);
		let after: Element = anchor;
		tags.forEach((tag) => {
			after.after(tag);
			after = tag;
		});
	}

	private tag(attr: "name" | "property", key: string, content: string): void {
		this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
	}

	private canonical(url: string): void {
		let link = this.document.head.querySelector<HTMLLinkElement>("link[rel=canonical]");
		if (!link) {
			link = this.document.createElement("link");
			link.rel = "canonical";
			this.document.head.appendChild(link);
		}
		link.href = url;
	}

	private jsonLd(data: object | object[] | undefined): void {
		this.document.head.querySelectorAll("script[data-page-ld]").forEach((el) => el.remove());
		if (!data) return;
		const script = this.document.createElement("script");
		script.type = "application/ld+json";
		script.setAttribute("data-page-ld", "");
		script.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
		this.document.head.appendChild(script);
	}
}

export const ORGANIZATION_LD = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "KONDOR Skupina ŠÁN z.s.",
	alternateName: "Dětská vodácká skupina ŠÁN",
	url: "https://bosan.cz",
	logo: "https://bosan.cz/img/logo.svg",
	email: "info@bosan.cz",
	taxID: "47610727",
	address: {
		"@type": "PostalAddress",
		streetAddress: "Podolské nábřeží 1180/5",
		addressLocality: "Praha 4",
		addressCountry: "CZ",
	},
	sameAs: [
		"https://www.instagram.com/bosan.cz/",
		"https://www.facebook.com/bosan.cz/",
		"https://www.youtube.com/channel/UCXYrg3UCZtu4_wlYR2Cj_5A",
	],
};
