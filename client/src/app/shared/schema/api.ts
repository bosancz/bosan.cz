export interface DocumentLink {
  href:string;
  allowed:{ [method:string]: boolean };
  templated?:boolean;
}

export interface DocumentAction {
  href:string;
  allowed:boolean;
}

export class Document {
  _links?:{
    self: DocumentLink,
    [link:string]:DocumentLink
  };
  _actions?:{
    [link:string]:DocumentAction
  };
}