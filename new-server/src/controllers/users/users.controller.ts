import { Controller, Get, Query } from '@nestjs/common';

import User from 'models/user.entity';

import UsersService from './users.service';

@Controller()
class UsersController {
  constructor(private readonly usersService: UsersService) {}

  static path: string = '/users';

  @Get(UsersController.path)
  findAll(@Query('members') members: boolean): Promise<User[]> {
    return this.usersService.findAll(members);
  }
}

export default UsersController;
