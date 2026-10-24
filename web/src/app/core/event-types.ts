const ICONS: Record<string, string> = {
	voda: "kayak",
	cyklo: "bike",
	lyže: "ski",
	"peší výlet": "mountains",
	brigáda: "repair",
	tábor: "tent",
	bazén: "swimmingpool",
	"po Praze": "town",
	schůzka: "playground",
	tvořivé: "scissors",
	"pro rodiče": "playground",
	školení: "paint",
};

export function eventTypeIcon(type: string | null | undefined): string {
	return `/img/event-types/${ICONS[type ?? ""] ?? "playground"}.svg`;
}
