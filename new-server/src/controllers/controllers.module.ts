import { Module } from '@nestjs/common';

import UserControllerModule from './user/user.module';

@Module({ imports: [UserControllerModule] })
class ControllersModule {}

export default ControllersModule;
