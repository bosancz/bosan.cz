import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import User, { UserEntity } from './user.entity';
import UserModelService from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserEntity }]),
  ],
  providers: [UserModelService],
  exports: [UserModelService],
})
class UserModelModule {}

export default UserModelModule;
