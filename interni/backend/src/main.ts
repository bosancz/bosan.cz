import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Config } from "./config";

async function bootstrap() {
  const logger = new Logger("MAIN");

  logger.log("Bošán - Interní sekce");
  logger.log(`Verze: ${Config.app.version}`);

  const app = await NestFactory.create(AppModule, {
    logger: Config.logging.level,
    rawBody: true,
  });

  app.setGlobalPrefix(Config.server.baseDir + "/api");

  if (!Config.production) {
    // make JSONs nice for debugging
    app.getHttpAdapter().getInstance().set("json spaces", 2);
  }

  if (Config.cors.enable) {
    // enable local app access
    app.enableCors(Config.cors.options);
  }

  // OpenAPI
  const config = new DocumentBuilder()
    .setTitle(Config.app.name)
    .setVersion(`v${Config.app.version}`)
    // .addSecurity("AuthToken", { type: "apiKey", name: "token", in: "query" })
    .build();
  const document = SwaggerModule.createDocument(app, config, { operationIdFactory: (controllerKey, methodKey) => methodKey });
  SwaggerModule.setup("/api", app, document, { customSiteTitle: `${Config.app.name} API` });

  const port = Config.server.port;
  const host = Config.server.host;

  await app.listen(port, host);
  logger.log(`Server started at ${host}:${port}`);
}
bootstrap();
