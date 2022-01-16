
export interface EventType {
  image?: string;
  color: string;
}

export enum EventTypeID {
  "voda" = "voda",
  "cyklo" = "cyklo",
  "lyže" = "lyže",
  "peší výlet" = "peší výlet",
  "brigáda" = "brigáda",
  "bazén" = "bazén",
  "po Praze" = "po Praze",
  "schůzka" = "schůzka",
  "školení" = "školení",
  "pro rodiče" = "pro rodiče",
  "tvořivé" = "tvořivé",
  "tábor" = "tábor"
}

export const EventTypes: { [key in EventTypeID]: EventType } = {
  "voda": {
    "image": "/assets/img/events/types/kayak.svg",
    "color": "#00000000"
  },
  "cyklo": {
    "image": "/assets/img/events/types/bike.svg",
    "color": "#00000000"
  },
  "lyže": {
    "image": "/assets/img/events/types/ski.svg",
    "color": "#00000000"
  },
  "peší výlet": {
    "image": "/assets/img/events/types/mountains.svg",
    "color": "#00000000"
  },
  "brigáda": {
    "image": "/assets/img/events/types/repair.svg",
    "color": "#00000000"
  },
  "tábor": {
    "image": "/assets/img/events/types/tent.svg",
    "color": "#00000000"
  },
  "bazén": {
    "image": "/assets/img/events/types/swimmingpool.svg",
    "color": "#00000000"
  },
  "po Praze": {
    "image": "/assets/img/events/types/town.svg",
    "color": "#00000000"
  },
  "schůzka": {
    "image": "/assets/img/events/types/playground.svg",
    "color": "#00000000"
  },
  "školení": {
    "color": "#ccc",
  },
  "pro rodiče": {
    "color": "#BB0000",
  },
  "tvořivé": {
    "color": "#00000000",
    "image": "/assets/img/events/types/scissors.svg"
  }
};