import { Pipe, PipeTransform } from "@angular/core";
import { Marked } from "marked";
import { typographyExtension } from "./typography";

const marked = new Marked({ async: false, breaks: true, gfm: true }, typographyExtension);

export function renderMarkdown(text: string | null | undefined): string {
	if (!text) return "";
	return marked.parse(text) as string;
}

export function markdownToText(text: string | null | undefined): string {
	return renderMarkdown(text)
		.replace(/<\/(p|li|h[1-6]|blockquote|pre)>|<br\s*\/?>/g, " ")
		.replace(/<[^>]*>/g, "")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/[^\S\u00a0]+/g, " ")
		.trim();
}

export function markdownParagraphs(text: string | null | undefined): string[] {
	if (!text) return [];
	return text
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)
		.map((paragraph) => marked.parseInline(paragraph) as string);
}

@Pipe({ name: "paragraphs" })
export class ParagraphsPipe implements PipeTransform {
	transform(text: string | null | undefined): string[] {
		return markdownParagraphs(text);
	}
}

@Pipe({ name: "inlineMarkdown" })
export class InlineMarkdownPipe implements PipeTransform {
	transform(text: string | null | undefined): string {
		return markdownParagraphs(text).join(" ");
	}
}

@Pipe({ name: "markdown" })
export class MarkdownPipe implements PipeTransform {
	transform(text: string | null | undefined): string {
		return renderMarkdown(text);
	}
}
