import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import databaseConfig from './config/database';
import ControllersModule from './controllers/controllers.module';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri, { useCreateIndex: true }),
    ControllersModule,
  ],
})
class AppModule {}

export default AppModule;
