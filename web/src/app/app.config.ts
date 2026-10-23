import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from "@angular/core";
import { provideServiceWorker } from "@angular/service-worker";

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideServiceWorker("ngsw-worker.js", {
			enabled: !isDevMode(),
			registrationStrategy: "registerWhenStable:30000",
		}),
	],
};
