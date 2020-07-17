import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema()
class Member extends mongoose.Document {
  @Prop()
  srcId: number;

  @Prop()
  nickname: string;

  @Prop()
  'group': string;

  @Prop()
  'role': string;

  @Prop()
  'function': string;

  @Prop()
  'rank': string;

  @Prop({ default: false })
  'inactive': boolean;

  @Prop()
  'membership': string;

  @Prop(
    raw({
      first: { type: String },
      last: { type: String },
    }),
  )
  'name': Record<string, string>;

  @Prop()
  'birthday': Date;

  @Prop(
    raw({
      street: String,
      streetNo: String,
      city: String,
      postalCode: String,
      country: String,
    }),
  )
  'address': Record<string, string>;

  @Prop(raw({ mobile: String, email: String, mother: String, father: String }))
  'contacts': Record<string, string>;

  @Prop([
    raw({
      id: String,
      dateFrom: Date,
      dateTill: Date,
    }),
  ])
  'achievements': Record<string, any>[];

  @Prop({ select: false })
  'faceDescriptor': number;
}

export default Member;

export const MemberEntity = SchemaFactory.createForClass(Member);
