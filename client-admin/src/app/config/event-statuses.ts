export interface EventStatus {
  name: string;
  color: string;
}

export type EventStatusID = keyof typeof EventStatuses;

const asEventStatuses = <T>(value: { [key in keyof T]: EventStatus }) => value;

export const EventStatuses = asEventStatuses({

  "draft": {
    "name": "Připravovaná",
    "color": "#92949c"
  },
  "pending": {
    "name": "Čeká na schválení",
    "color": "#ffc409"
  },
  "public": {
    "name": "V programu",
    "color": "#2dd36f"
  },
  "cancelled": {
    "name": "Zrušená",
    "color": "#eb445a"
  },
  "finalized": {
    "name": "Uzavřená",
    "color": "#222428"
  },
  "rejected": {
    "name": "Vrácená k úpravám",
    "color": "#ffc409"
  }
});