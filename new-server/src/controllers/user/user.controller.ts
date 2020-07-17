import { Controller, Get } from '@nestjs/common';

import User from 'models/user/user.entity';
import UserModelService from 'models/user/user.service';

@Controller()
class UserController {
  constructor(private readonly userModelService: UserModelService) {}

  static path: string = '/user';

  @Get(UserController.path)
  findAll(): Promise<User[]> {
    return this.userModelService.findAll();
  }
}

export default UserController;
