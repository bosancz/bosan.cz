import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import User, { UserEntity } from 'models/user.entity';

import UserController from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserEntity }]),
  ],
  controllers: [UserController],
})
class UserControllerModule {}

export default UserControllerModule;
