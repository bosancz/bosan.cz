import { Event } from "./event";

export interface Dashboard {
  noLeaderEventsCount: number;
  program: Event[];
}