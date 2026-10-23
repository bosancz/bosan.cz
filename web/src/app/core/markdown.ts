import { Pipe, PipeTransform } from "@angular/core";
import { marked } from "marked";

export function renderMarkdown(text: string | null | undefined): string {
	if (!text) return "";
	return marked.parse(text, { async: false, breaks: true, gfm: true });
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
		.replace(/\s+/g, " ")
		.trim();
}

@Pipe({ name: "markdown" })
export class MarkdownPipe implements PipeTransform {
	transform(text: string | null | undefined): string {
		return renderMarkdown(text);
	}
}
