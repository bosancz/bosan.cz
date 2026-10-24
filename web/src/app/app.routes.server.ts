import { inject } from "@angular/core";
import { RenderMode, ServerRoute } from "@angular/ssr";
import { ApiService } from "./core/api.service";

export const serverRoutes: ServerRoute[] = [
	{
		path: "fotogalerie/:album",
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			const albums = await inject(ApiService).fetchGalleryAlbumIds();
			return albums.map((album) => ({ album }));
		},
	},
	{ path: "fotogalerie/:album/:photo", renderMode: RenderMode.Client },
	{
		path: "kroniky/:report",
		renderMode: RenderMode.Prerender,
		async getPrerenderParams() {
			const reports = await inject(ApiService).fetchReportIds();
			return reports.map((report) => ({ report }));
		},
	},
	{ path: "**", renderMode: RenderMode.Prerender },
];
