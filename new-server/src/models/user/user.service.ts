import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import User from './user.entity';

class UserModelService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }
}

export default UserModelService;
