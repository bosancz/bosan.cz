import { Module } from '@nestjs/common';

import ConfigController from './config.controller';

@Module({ controllers: [ConfigController] })
class ConfigModule {}

export default ConfigModule;
