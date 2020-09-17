import { Controller, Get } from '@nestjs/common';

import User from 'models/user.entity';

@Controller()
class UserController {
  static path: string = '/user';

  @Get(UserController.path)
  findAll(): Promise<User[]> {
    return Promise.resolve([]);
  }
}

export default UserController;
