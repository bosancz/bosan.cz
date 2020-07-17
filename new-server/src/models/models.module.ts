import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import Member, { MemberEntity } from './member.entity';
import User, { UserEntity } from './user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserEntity },
      { name: Member.name, schema: MemberEntity },
    ]),
  ],
})
class ModelsModule {}

export default ModelsModule;
