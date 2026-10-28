import { inject } from "@angular/core";
import { RenderMode, ServerRoute } from "@angular/ssr";
import { ApiService } from "./core/api.service";

export const serverRoutes: ServerRoute[] = [
	{
		path: "jak-jsme-se-meli/album/:album",
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			const albums = await inject(ApiService).fetchGalleryAlbumIds();
			return albums.map((album) => ({ album }));
		},
	},
	{ path: "jak-jsme-se-meli/album/:album/:photo", renderMode: RenderMode.Client },
	{
		path: "jak-jsme-se-meli/:report",
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			const reports = await inject(ApiService).fetchReportIds();
			return reports.map((report) => ({ report }));
		},
	},
	{ path: "**", renderMode: RenderMode.Prerender },
];
