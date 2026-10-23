import { TestBed } from "@angular/core/testing";
import { App } from "./app";

describe("App", () => {
	it("renders the title", async () => {
		const fixture = TestBed.createComponent(App);
		await fixture.whenStable();
		expect((fixture.nativeElement as HTMLElement).querySelector("h1")?.textContent).toContain("App");
	});
});
