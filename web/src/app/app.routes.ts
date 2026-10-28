import { Routes } from "@angular/router";

export const routes: Routes = [
	{ path: "", loadComponent: () => import("./pages/news/news-page").then((m) => m.NewsPage) },
	{ path: "aktualne", redirectTo: "", pathMatch: "full" },
	{ path: "program", loadComponent: () => import("./pages/program/program-page").then((m) => m.ProgramPage) },
	{
		path: "jak-jsme-se-meli",
		loadComponent: () => import("./pages/gallery/gallery-page").then((m) => m.GalleryPage),
	},
	{
		path: "jak-jsme-se-meli/album/:album",
		loadComponent: () => import("./pages/gallery/album-page").then((m) => m.AlbumPage),
	},
	{
		path: "jak-jsme-se-meli/album/:album/:photo",
		loadComponent: () => import("./pages/gallery/album-page").then((m) => m.AlbumPage),
	},
	{
		path: "jak-jsme-se-meli/:report",
		loadComponent: () => import("./pages/reports/report-page").then((m) => m.ReportPage),
	},
	{ path: "tabor", loadComponent: () => import("./pages/camp/camp-page").then((m) => m.CampPage) },
	{ path: "o-nas", loadComponent: () => import("./pages/about/about-page").then((m) => m.AboutPage) },
	{ path: "kontakty", loadComponent: () => import("./pages/contacts/contacts-page").then((m) => m.ContactsPage) },
	{
		path: "404",
		loadComponent: () => import("./pages/not-found/not-found-page").then((m) => m.NotFoundPage),
	},
	{
		path: "**",
		loadComponent: () => import("./pages/not-found/not-found-page").then((m) => m.NotFoundPage),
	},
];
