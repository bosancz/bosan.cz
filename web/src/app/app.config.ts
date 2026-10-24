import { ViewportScroller } from "@angular/common";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideClientHydration, withEventReplay } from "@angular/platform-browser";
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from "@angular/router";
import { routes } from "./app.routes";
import { SectionViewportScroller } from "./core/viewport-scroller";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideRouter(
			routes,
			withComponentInputBinding(),
			withInMemoryScrolling({ anchorScrolling: "enabled", scrollPositionRestoration: "enabled" }),
		),
		{ provide: ViewportScroller, useClass: SectionViewportScroller },
		provideHttpClient(withFetch()),
		provideClientHydration(withEventReplay()),
	],
};
