import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import databaseConfig from './config/database';
import ControllersModule from './controllers/controllers.module';
import ModelsModule from './models/models.module';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, { useCreateIndex: true }),
    ModelsModule,
    ControllersModule,
  ],
})
class AppModule {}

export default AppModule;
