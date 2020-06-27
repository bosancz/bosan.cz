import { Controller, Get } from '@nestjs/common';

import AppService from './app.service';

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}

export default AppController;
