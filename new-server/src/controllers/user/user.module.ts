import { Module } from '@nestjs/common';

import UserModelModule from '../../models/user/user.module';

import UserController from './user.controller';

@Module({ imports: [UserModelModule], controllers: [UserController] })
class UserControllerModule {}

export default UserControllerModule;
