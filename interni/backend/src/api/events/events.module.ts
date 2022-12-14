import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';

@Module({
  controllers: [EventsController]
})
export class EventsModule {}
