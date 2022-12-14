import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { EventsModule } from './api/events/events.module';
import * as path from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../frontend/dist"),
    }),
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
