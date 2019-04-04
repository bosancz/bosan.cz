import { Document } from "./api";
import { Member } from "./member";

export class EventRecurring {
  recurring: string;
  startDate: Date;
  endDate: Date;
  instances: any[];
}

export class EventExpense {
  id: string;
  amount: number;
  type: string;
  description: string;
}

export class Event extends Document {

  _id: string;
  status: string;
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

  recurring?: EventRecurring;

  order?: number;

  meeting?: {
    start?: string,
    end?: string
  } = {};

  attendees?: Member[] = [];
  leaders?: Member[] = [];

  registration?: string;

  groups?: string[];
  leadersEvent?: boolean;

  competition: { river: string, water_km: number };

  expenses: EventExpense[] = [];
}