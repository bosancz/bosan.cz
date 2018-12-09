export interface HalLink {
  allowed: {
    [method:string]: boolean
  };
  href:string;
}

export interface HalLinks {
  [name:string]:HalLink;
}