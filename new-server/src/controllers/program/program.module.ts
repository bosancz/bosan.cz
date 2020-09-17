import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import Event, { EventSchema } from '../../models/event.entity';

import ProgramService from './program.service';
import ProgramController from './program.controller';

@Module({
  controllers: [ProgramController],
  providers: [ProgramService],
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
})
class ProgramModule {}

export default ProgramModule;
