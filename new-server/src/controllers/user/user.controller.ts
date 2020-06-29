import { Controller, Get } from '@nestjs/common';

import User from 'models/user/user.schema';
import UserModule from 'models/user/userModel.service';

@Controller()
class UserController {
  constructor(private readonly userModelService: UserModule) {}

  static path: string = '/user';

  @Get(UserController.path)
  findAll(): Promise<User[]> {
    return this.userModelService.findAll();
  }
}

export default UserController;
