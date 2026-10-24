export function goToSection(document: Document, id: string | null): void {
	const view = document.defaultView;
	if (!view) return;
	const { history, location } = view;
	history.replaceState(history.state, "", location.pathname + location.search + (id ? `#${id}` : ""));
	const target = id ? document.getElementById(id) : null;
	if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
	else view.scrollTo({ top: 0, behavior: "smooth" });
}
