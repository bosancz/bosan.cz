import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import User from 'models/user.entity';

class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findAll(members: boolean): Promise<User[]> {
    const query = this.userModel.find().select('_id login member roles email');
    if (members) query.populate('member', '_id nickname name group');

    return query.exec();
  }
}

export default UsersService;
