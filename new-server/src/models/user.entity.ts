import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
class User extends mongoose.Document {
  @Prop({ unique: true })
  login: string;

  @Prop({ select: false })
  password: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop({ type: [String] })
  roles: string[];

  @Prop({ index: { unique: true, sparse: true } })
  loginCode: string;

  @Prop()
  loginCodeExp: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  member: number;

  @Prop([String])
  notifications: string[];

  @Prop({ select: false })
  pushSubscriptions: any;
}

export default User;

export const UserEntity = SchemaFactory.createForClass(User);
