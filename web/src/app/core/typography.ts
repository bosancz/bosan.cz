import {
	AfterViewInit,
	Directive,
	ElementRef,
	Injectable,
	inject,
	makeStateKey,
	Pipe,
	PipeTransform,
	PLATFORM_ID,
	TransferState,
} from "@angular/core";
import { isPlatformServer } from "@angular/common";
import type { MarkedExtension, Token, Tokens } from "marked";
import { fixTypos } from "typopo";

const BOUNDARY = "⁠";
const OPAQUE = "￼";

const BLOCK_TYPES = new Set(["paragraph", "heading", "list", "blockquote", "code", "table", "hr", "space", "def"]);

type TextLeaf = Tokens.Text | Tokens.Escape;

const fixed = new Map<string, string>();

const TYPOGRAPHY_STATE = makeStateKey<Record<string, string | 0>>("typography");

export function fixTypography(text: string): string;
export function fixTypography(text: string | null | undefined): string | null | undefined;
export function fixTypography(text: string | null | undefined): string | null | undefined {
	if (!text) return text;
	let result = fixed.get(text);
	if (result === undefined) {
		result = fixTypos(text, "cs", { removeLines: false });
		fixed.set(text, result);
	}
	return result;
}

@Injectable({ providedIn: "root" })
export class TypographyService {
	private readonly used = isPlatformServer(inject(PLATFORM_ID)) ? new Map<string, string>() : null;

	constructor() {
		const state = inject(TransferState);
		if (this.used) {
			const used = this.used;
			state.onSerialize(TYPOGRAPHY_STATE, () =>
				Object.fromEntries([...used].map(([text, result]) => [text, result === text ? 0 : result])),
			);
			return;
		}
		const transferred = state.get(TYPOGRAPHY_STATE, null);
		if (!transferred) return;
		state.remove(TYPOGRAPHY_STATE);
		for (const [text, result] of Object.entries(transferred)) fixed.set(text, result === 0 ? text : result);
	}

	fix(text: string | null | undefined): string {
		const result = fixTypography(text) ?? "";
		if (text) this.used?.set(text, result);
		return result;
	}
}

export function fixTokensTypography<T extends Token[]>(tokens: T): T {
	if (isInline(tokens)) fixInline(tokens);
	else tokens.forEach(fixBlock);
	return tokens;
}

export const typographyExtension: MarkedExtension = {
	hooks: {
		processAllTokens: (tokens) => fixTokensTypography(tokens as Token[]),
	},
};

function isInline(tokens: Token[]): boolean {
	return tokens.every(
		(token) => !BLOCK_TYPES.has(token.type) && !(token.type === "text" && "tokens" in token && token.tokens),
	);
}

function fixBlock(token: Token): void {
	switch (token.type) {
		case "paragraph":
		case "heading":
			fixInline(token.tokens ?? []);
			break;
		case "text":
			if (token.tokens) fixInline(token.tokens);
			break;
		case "blockquote":
			token.tokens?.forEach(fixBlock);
			break;
		case "list":
			(token as Tokens.List).items.forEach((item) => item.tokens.forEach(fixBlock));
			break;
		case "table": {
			const table = token as Tokens.Table;
			[table.header, ...table.rows].forEach((row) => row.forEach((cell) => fixInline(cell.tokens)));
			break;
		}
	}
}

function fixInline(tokens: Token[]): void {
	const leaves: (TextLeaf | null)[] = [];
	collectLeaves(tokens, leaves);

	const texts = leaves.filter((leaf): leaf is TextLeaf => !!leaf);
	if (!texts.length) return;

	const joined = leaves.map((leaf) => (leaf ? leaf.text : OPAQUE)).join(BOUNDARY);
	const parts = fixTypography(joined).split(BOUNDARY);

	if (parts.length === leaves.length) {
		leaves.forEach((leaf, index) => {
			if (leaf) leaf.text = parts[index];
		});
	} else {
		texts.forEach((leaf) => (leaf.text = fixTypography(leaf.text)));
	}
}

function collectLeaves(tokens: Token[], leaves: (TextLeaf | null)[]): void {
	for (const token of tokens) {
		switch (token.type) {
			case "text":
				if ("tokens" in token && token.tokens) collectLeaves(token.tokens, leaves);
				else if ((token as Tokens.Text).escaped) leaves.push(null);
				else leaves.push(token as Tokens.Text);
				break;
			case "escape":
				leaves.push(token as Tokens.Escape);
				break;
			case "strong":
			case "em":
			case "del":
				collectLeaves(token.tokens ?? [], leaves);
				break;
			case "link": {
				const link = token as Tokens.Link;
				if (isAutolink(link)) leaves.push(null);
				else collectLeaves(link.tokens, leaves);
				break;
			}
			default:
				leaves.push(null);
		}
	}
}

function isAutolink(link: Tokens.Link): boolean {
	return link.text === link.href || `mailto:${link.text}` === link.href;
}

@Pipe({ name: "typography" })
export class TypographyPipe implements PipeTransform {
	private readonly typography = inject(TypographyService);

	transform(text: string | null | undefined): string {
		return this.typography.fix(text);
	}
}

@Directive({ selector: "[boTypography]" })
export class TypographyDirective implements AfterViewInit {
	private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

	ngAfterViewInit(): void {
		fixNodeTypography(this.element.nativeElement);
	}
}

function fixNodeTypography(node: Node): void {
	if (node.nodeType === 3) {
		const text = node.nodeValue ?? "";
		const fixed = fixTypography(text.trim());
		if (fixed) node.nodeValue = text.match(/^\s*/)![0] + fixed + text.match(/\s*$/)![0];
		return;
	}
	node.childNodes.forEach(fixNodeTypography);
}
