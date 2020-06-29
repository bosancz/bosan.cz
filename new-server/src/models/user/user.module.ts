import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import User, { UserSchema } from './user.schema';
import UserModule from './userModel.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserModule],
  exports: [UserModule],
})
class UserModelModule {}

export default UserModelModule;
