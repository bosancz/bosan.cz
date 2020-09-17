import * as path from 'path';
import * as fs from 'fs';

import { Controller, Get, Res } from '@nestjs/common';

import { storage } from 'config';
import ResponseType from 'helpers/responseType';

@Controller('config')
class ConfigController {
  @Get()
  get(@Res() res: ResponseType): void {
    const configFile = path.resolve(storage.config, 'web-config.json');
    if (fs.existsSync(configFile)) {
      res.sendFile(configFile);
    } else {
      res.json({});
    }
  }
}

export default ConfigController;
