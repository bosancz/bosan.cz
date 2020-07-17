import { Module } from '@nestjs/common';

import UserControllerModule from './user/user.module';
import UsersModule from './users/users.module';

@Module({ imports: [UserControllerModule, UsersModule] })
class ControllersModule {}

export default ControllersModule;
