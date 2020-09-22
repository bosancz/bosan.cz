import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import Event, { EventSchema } from './event.entity';
import EventRecurring, { EventRecurringSchema } from './eventRecurring.entity';
import Member, { MemberSchema } from './member.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventRecurring.name, schema: EventRecurringSchema },
      { name: Member.name, schema: MemberSchema },
    ]),
  ],
})
class ModelsModule {}

export default ModelsModule;
