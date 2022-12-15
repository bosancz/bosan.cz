import { ApiProperty } from "@nestjs/swagger";
import { Document, DocumentLink } from "src/schema/document";

class EventResponseLinks {
  @ApiProperty()
  self: DocumentLink;
  @ApiProperty()
  attendees!: DocumentLink;
}

export class EventResponseDto implements Document<"attendees", string> {
  @ApiProperty()
  _id!: string;

  @ApiProperty()
  _links?: EventResponseLinks;
}
