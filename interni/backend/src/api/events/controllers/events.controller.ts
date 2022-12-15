import { Controller, Get } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { AcController } from "src/models/access-control/decorators/ac-controller.decorator";
import { AcEntity, EntitiesStore } from "src/models/access-control/decorators/ac-entity.decorator";
import { EventResponseDto } from "../dto/event-response.dto";

@Controller("events")
@AcController()
export class EventsController {
  constructor() {}

  @Get()
  @AcEntity("event")
  @ApiResponse({ type: EventResponseDto, isArray: true })
  async listEvents(): Promise<EventResponseDto[]> {
    console.log(EntitiesStore);
    return [
      {
        _id: "a",
      },
    ];
  }

  @Get("attendees")
  @AcEntity("event:attendees")
  async getEventAttendees(): Promise<EventResponseDto[]> {
    return [
      {
        _id: "a",
      },
    ];
  }
}
