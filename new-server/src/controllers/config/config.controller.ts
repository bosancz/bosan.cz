import * as path from 'path';
import * as fs from 'fs';

import { Controller, Get } from '@nestjs/common';

import { storage } from 'config';

@Controller('config')
class ConfigController {
  @Get()
  get(): Record<any, any> {
    const configFile = path.resolve(storage.config, 'web-config.json');
    if (fs.existsSync(configFile)) {
      return JSON.parse(fs.readFileSync(configFile).toString());
    }

    return {};
  }
}

export default ConfigController;
