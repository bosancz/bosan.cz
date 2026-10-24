import { ChangeDetectionStrategy, Component, DOCUMENT, afterNextRender, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ORGANIZATION_LD, SeoService } from "../../core/seo.service";
import { InlineMarkdownPipe, ParagraphsPipe } from "../../core/markdown";
import { ABOUT_CONTENT } from "../../../content/content";
import { CHILD_GROUPS, FRIENDS_CLUB } from "../../core/groups";

const SECTIONS = [
	{ id: "o-hist", label: "z historie" },
	{ id: "o-ostrov", label: "ostrov Šán" },
	{ id: "o-oddily", label: "oddíly" },
];

@Component({
	selector: "bo-about-page",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterLink, ParagraphsPipe, InlineMarkdownPipe],
	templateUrl: "./about-page.html",
	styleUrl: "./about-page.scss",
})
export class AboutPage {
	private readonly document = inject(DOCUMENT);

	protected readonly content = ABOUT_CONTENT;
	protected readonly sections = SECTIONS;
	protected readonly groups = CHILD_GROUPS;
	protected readonly friends = FRIENDS_CLUB;
	protected readonly active = signal(SECTIONS[0].id);
	protected readonly tocOpen = signal(false);

	constructor() {
		inject(SeoService).set({
			title: "O nás",
			description: ABOUT_CONTENT.seo.description,
			path: "/o-nas",
			image: ABOUT_CONTENT.hero.photo.src,
			imageAlt: ABOUT_CONTENT.hero.photo.alt,
			jsonLd: {
				"@context": "https://schema.org",
				"@type": "AboutPage",
				name: "O nás",
				url: "https://bosan.cz/o-nas",
				mainEntity: ORGANIZATION_LD,
			},
		});

		afterNextRender(() => {
			const view = this.document.defaultView;
			if (!view || !("IntersectionObserver" in view)) return;
			const visible = new Set<string>();
			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						if (entry.isIntersecting) visible.add(entry.target.id);
						else visible.delete(entry.target.id);
					}
					const current = SECTIONS.find((section) => visible.has(section.id));
					if (current) this.active.set(current.id);
				},
				{ rootMargin: "-90px 0px -55% 0px" },
			);
			for (const section of SECTIONS) {
				const element = this.document.getElementById(section.id);
				if (element) observer.observe(element);
			}
		});
	}

	protected go(event: Event, id: string | null): void {
		event.preventDefault();
		this.tocOpen.set(false);
		const target = id ? this.document.getElementById(id) : null;
		const view = this.document.defaultView;
		if (!view) return;
		if (target) {
			target.scrollIntoView({ behavior: "smooth", block: "start" });
			if (id) this.active.set(id);
		} else view.scrollTo({ top: 0, behavior: "smooth" });
	}

	protected activeLabel(): string {
		return SECTIONS.find((section) => section.id === this.active())?.label ?? "";
	}
}
