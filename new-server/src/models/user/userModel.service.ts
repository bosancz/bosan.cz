import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import User from './user.schema';

class UserModule {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }
}

export default UserModule;
