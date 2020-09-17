import { Controller, Get } from '@nestjs/common';

import Event from 'models/event.entity';

import ProgramService from './program.service';

@Controller('program')
class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  find(): Promise<Event[]> {
    return this.programService.find({});
  }
}

export default ProgramController;
