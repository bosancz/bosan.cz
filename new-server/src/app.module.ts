import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import databaseConfig from './config/database';
import ControllersModule from './controllers/controllers.module';
import ModelsModule from './models/models.module';
import AppController from './app.controller';
import AppService from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, { useCreateIndex: true }),
    ModelsModule,
    ControllersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
class AppModule {}

export default AppModule;
