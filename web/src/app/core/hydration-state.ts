import { ApplicationRef, Injectable, PLATFORM_ID, inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Injectable({ providedIn: "root" })
export class HydrationState {
	done = !isPlatformBrowser(inject(PLATFORM_ID));

	constructor() {
		if (!this.done) {
			inject(ApplicationRef)
				.whenStable()
				.then(() => (this.done = true));
		}
	}
}
