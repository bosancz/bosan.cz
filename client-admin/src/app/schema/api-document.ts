

export interface DocumentLinkAllowed {
  GET?: boolean;
  POST?: boolean;
  PUT?: boolean;
  PATCH?: boolean;
  DELETE?: boolean;
}

export interface DocumentLink {
  href: string;
  allowed: DocumentLinkAllowed;
  templated?: boolean;
}

export interface DocumentAction {
  href: string;
  allowed: boolean;
}

export class Document {
  _links?: {
    self: DocumentLink,
    [link: string]: DocumentLink;
  };
  _actions?: {
    [link: string]: DocumentAction;
  };
}