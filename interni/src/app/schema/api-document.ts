

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

export class Document<L extends string = string, A extends string = string> {
  _links?: {
    [link in L | "self"]: DocumentLink;
  };
  _actions?: {
    [link in A]: DocumentAction;
  };
}