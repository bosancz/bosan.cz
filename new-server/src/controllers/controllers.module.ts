import { Module } from '@nestjs/common';

import ProgramModule from './program/program.module';
import ConfigModule from './config/config.module';

@Module({ imports: [ProgramModule, ConfigModule] })
class ControllersModule {}

export default ControllersModule;
