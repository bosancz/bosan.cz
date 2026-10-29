import { HttpClient } from "@angular/common/http";
import { Injectable, PLATFORM_ID, inject, signal } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { environment } from "../../environments/environment";

interface Account {
	roles?: string[];
}

@Injectable({ providedIn: "root" })
export class AccountService {
	private readonly leader = signal(false);

	readonly isLeader = this.leader.asReadonly();

	constructor() {
		if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
		inject(HttpClient)
			.get<Account>(environment.apiRoot + "/account", { withCredentials: true, transferCache: false })
			.subscribe({
				next: (account) => this.leader.set(!!account?.roles?.includes("vedouci")),
				error: () => undefined,
			});
	}

	eventUrl(eventId: string): string {
		return `${environment.interniUrl}/akce/${encodeURIComponent(eventId)}`;
	}

	reportUrl(eventId: string): string {
		return `${this.eventUrl(eventId)}?tab=report`;
	}

	albumUrl(albumId: string): string {
		return `${environment.interniUrl}/galerie/alba/${encodeURIComponent(albumId)}`;
	}
}
