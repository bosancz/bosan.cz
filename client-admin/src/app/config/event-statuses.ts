export interface EventStatus {
  name: string;
  color: string;
}

export type EventStatusID = keyof typeof EventStatuses;

const asEventStatuses = <T>(value: { [key in keyof T]: EventStatus }) => value;

export const EventStatuses = asEventStatuses({

  "draft": {
    "name": "Připravovaná",
    "color": "dark"
  },
  "pending": {
    "name": "Čeká na schválení",
    "color": "warning"
  },
  "public": {
    "name": "V programu",
    "color": "success"
  },
  "cancelled": {
    "name": "Zrušená",
    "color": "danger"
  },
  "finalized": {
    "name": "Uzavřená",
    "color": "dark"
  },
  "rejected": {
    "name": "Vrácená k úpravám",
    "color": "warning"
  }
});