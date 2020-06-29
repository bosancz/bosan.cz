import { Module } from '@nestjs/common';

import UserModelModule from './user/user.module';

@Module({ imports: [UserModelModule] })
class ModelsModule {}

export default ModelsModule;
