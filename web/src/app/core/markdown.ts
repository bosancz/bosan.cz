import { Pipe, PipeTransform } from "@angular/core";
import { marked } from "marked";

export function renderMarkdown(text: string | null | undefined): string {
	if (!text) return "";
	return marked.parse(text, { async: false, breaks: true, gfm: true });
}

export function markdownToText(text: string | null | undefined): string {
	return renderMarkdown(text)
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/\s+/g, " ")
		.trim();
}

export function markdownParagraphs(text: string | null | undefined): string[] {
	if (!text) return [];
	return text
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)
		.map((paragraph) => marked.parseInline(paragraph, { async: false, breaks: true, gfm: true }));
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
