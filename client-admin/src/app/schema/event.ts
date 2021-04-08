import { EventStatuses } from "app/config/statuses";
import { Document } from "./api";
import { EventStatus } from "./event-status";
import { Member } from "./member";

export interface EventExpense {
  id: string;
  amount: number;
  type: string;
  description: string;
}

export interface Event extends Document {

  _id: string;
  status: EventStatus["id"];
  statusNote: string;

  name: string;
  type: string;
  subtype: string;
  place: string;
  description: string;

  dateFrom: string;
  dateTill: string;
  timeFrom: string;
  timeTill: string;

  order?: number;

  meeting?: {
    start?: string,
    end?: string;
  };

  attendees?: Member[];
  leaders?: Member[];

  registration?: string;

  groups?: string[];
  leadersEvent?: boolean;

  competition: { river: string, water_km: number; };

  expenses: EventExpense[];

  report: string;
}