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
	{ path: "**", renderMode: RenderMode.Prerender },
];
