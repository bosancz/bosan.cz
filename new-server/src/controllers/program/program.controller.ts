import { Controller, Get, Query } from '@nestjs/common';

import Event from 'models/event.entity';

import ProgramService from './program.service';
import ProgramGetParams from './params/get.params';

@Controller('program')
class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  get(@Query() params?: ProgramGetParams): Promise<Event[]> {
    return this.programService.find({
      limit: +params.limit,
      dateFrom: params.dateFrom ? new Date(params.dateFrom) : undefined,
      dateTill: params.dateTill ? new Date(params.dateTill) : undefined,
    });
  }
}

export default ProgramController;
