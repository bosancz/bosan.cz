export interface NavItem {
	label: string;
	path: string;
}

export const NAV_ITEMS: NavItem[] = [
	{ label: "Aktuálně", path: "/" },
	{ label: "Program", path: "/program" },
	{ label: "Jak jsme se měli", path: "/jak-jsme-se-meli" },
	{ label: "Tábor", path: "/tabor" },
	{ label: "O nás", path: "/o-nas" },
	{ label: "Kontakty", path: "/kontakty" },
];

export const INTERNAL_URL = "https://interni.bosan.cz";
