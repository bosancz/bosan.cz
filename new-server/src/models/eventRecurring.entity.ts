import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import Event from './event.entity';

@Schema()
class EventRecurring extends mongoose.Document {
  @Prop({
    enum: ['daily', 'weekly', 'monthly', 'monthlyDay', 'yearly'],
    required: true,
  })
  type: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }])
  events: Event[];
}

export default EventRecurring;

export const EventRecurringSchema = SchemaFactory.createForClass(
  EventRecurring,
);
