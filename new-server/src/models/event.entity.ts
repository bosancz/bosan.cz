import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import EventRecurring from './eventRecurring.entity';
import Member from './member.entity';

@Schema()
class Event extends Document {
  @Prop({
    required: true,
    enum: ['draft', 'pending', 'public', 'cancelled', 'rejected'],
    default: 'draft',
  })
  status: string;

  @Prop()
  statusNote: string;

  @Prop()
  srcId: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  place: string;

  @Prop()
  description: string;

  @Prop()
  dateFrom: Date;

  @Prop()
  dateTill: Date;

  @Prop()
  timeFrom: string;

  @Prop()
  timeTill: string;

  // TODO test without type definition
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'EventRecurring' })
  recurring: EventRecurring;

  @Prop()
  order: number;

  @Prop(raw({ start: String, end: String }))
  meeting: { start: string; end: string };

  @Prop()
  registration: string;

  @Prop()
  accounting: string;

  @Prop()
  announcement: string;

  @Prop()
  groups: string[];

  @Prop()
  leadersEvent: boolean;

  @Prop({ default: 'akce' })
  type: string;

  @Prop()
  subtype: string;

  @Prop()
  srcType: string;

  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: 'Member',
      autopopulate: { select: '_id nickname name group role' },
    },
  ])
  leaders: Member[];

  @Prop([
    {
      type: MongooseSchema.Types.ObjectId,
      ref: 'Member',
      autopopulate: { select: '_id nickname name group role' },
    },
  ])
  attendees: Member[];

  @Prop()
  leadersLine: string;

  @Prop(
    raw([
      {
        id: String,
        amount: Number,
        type: { type: String },
        description: String,
      },
    ]),
  )
  expenses: {
    id: string;
    amount: number;
    type: { type: string };
    description: string;
  }[];

  @Prop(
    raw({
      water_km: Number,
      river: String,
    }),
  )
  competition: { water_km: number; river: string };

  @Prop()
  etl: string;
}

export default Event;

export const EventSchema = SchemaFactory.createForClass(Event);
