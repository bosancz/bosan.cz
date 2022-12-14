import { Logger, LogLevel } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { readFileSync } from "fs";
import * as path from "path";

const logger = new Logger("CONFIG");

/**
 * Sets environment type (production/development) for use in other configurations
 */
const environment = process.env.ENVIRONMENT || "development";

const production = ["production", "staging"].includes(environment);

/**
 * Sets server startup settings
 * @property host - Server listening hostname
 * @property port - Server listening port
 * @property baseDir - Server base directory
 */
const server = {
  host: process.env.HOST || "0.0.0.0",
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  baseDir: process.env.BASE_DIR || "",
};

const logging: { level?: LogLevel[] } = {
  level: production ? ["log", "error", "warn"] : undefined,
};

const cors: { enable: boolean; options: CorsOptions } = {
  enable: !production,
  options: { credentials: true, origin: true },
};

/**
 * App
 */
const app = {
  name: "Bošán - Interní sekce",
  baseUrl: process.env["BASE_URL"] || `http://${server.host}${server.port ? ":" + server.port : ""}${server.baseDir}`,
  version: "0.0.0",
};

try {
  app.version = JSON.parse(readFileSync(path.join(__dirname, "../../package.json")).toString()).version;
} catch (err) {
  app.version = "ERR";
  logger.error(err);
}

export const Config = {
  server,
  app,
  environment,
  production,
  logging,
  cors,
};
