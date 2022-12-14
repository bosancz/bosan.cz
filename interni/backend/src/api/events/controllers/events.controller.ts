import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { EventResponseDto } from "../dto/event-response.dto";

@Controller("events")
export class EventsController {
  @Get()
  @ApiResponse({ type: EventResponseDto, isArray: true })
  async listEvents(): Promise<EventResponseDto[]> {
    return [
      {
        _id: "a",
      },
    ];
  }
}
