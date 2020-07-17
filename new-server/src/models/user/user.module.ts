import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import User, { UserSchema } from './user.schema';
import UserModelService from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserModelService],
  exports: [UserModelService],
})
class UserModelModule {}

export default UserModelModule;
