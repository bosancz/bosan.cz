import { Body, Controller, Get, Post, Put } from '@nestjs/common';

import AppService from './app.service';
import TestDto from './testDto';

@Controller()
class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  test(@Body() test: TestDto): boolean {
    return true;
  }
}

export default AppController;
