import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import User, { UserEntity } from 'models/user.entity';

import UsersController from './users.controller';
import UsersService from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserEntity }]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
class UsersModule {}

export default UsersModule;
