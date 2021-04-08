import { EventStatus } from "app/schema/event-status";


export const EventStatuses: { [key in EventStatus["id"]]: EventStatus; } = {

  "draft": {
    "id": "draft",
    "name": "Připravovaná",
    "color": "dark"
  },
  "pending": {
    "id": "pending",
    "name": "Čeká na schválení",
    "color": "warning"
  },
  "public": {
    "id": "public",
    "name": "V programu",
    "color": "success"
  },
  "cancelled": {
    "id": "cancelled",
    "name": "Zrušená",
    "color": "danger"
  },
  "finalized": {
    "id": "finalized",
    "name": "Uzavřená",
    "color": "dark"
  },
  "rejected": {
    "id": "rejected",
    "name": "Vrácená k úpravám",
    "color": "warning"
  }
};