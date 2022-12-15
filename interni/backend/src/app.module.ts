import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { EventsModule } from './api/events/events.module';
import { AccessControlModule } from './models/access-control/access-control.module';
import { DatabaseModule } from './models/database/database.module';
import * as path from "path";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "../../frontend/dist"),
    }),
    EventsModule,
    AccessControlModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
