import { ApiProperty } from "@nestjs/swagger";

export class DocumentLinkAllowed {
  @ApiProperty() GET?: boolean;
  @ApiProperty() POST?: boolean;
  @ApiProperty() PUT?: boolean;
  @ApiProperty() PATCH?: boolean;
  @ApiProperty() DELETE?: boolean;
}

export class DocumentLink {
  @ApiProperty() href: string;
  @ApiProperty() allowed: DocumentLinkAllowed;
  @ApiProperty() templated?: boolean;
}

export interface DocumentAction {
  href: string;
  allowed: boolean;
}

export interface Document<L extends string, A extends string> {
  _links?: {
    [link in L | "self"]: DocumentLink;
  };

  _actions?: {
    [link in A]: DocumentAction;
  };
}
