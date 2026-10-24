import { writeFileSync } from "node:fs";

const version = process.env.VERSION || "DEV";
writeFileSync(
	new URL("../src/environments/version.ts", import.meta.url),
	`export const APP_VERSION = ${JSON.stringify(version)};\n`,
);
console.log(`Version set to ${version}`);
