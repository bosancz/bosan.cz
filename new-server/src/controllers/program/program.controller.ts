import { Controller, Get } from '@nestjs/common';

import ProgramService from './program.service';

@Controller()
class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Get()
  find() {
    return this.programService.find({});
  }
}

export default ProgramController;
