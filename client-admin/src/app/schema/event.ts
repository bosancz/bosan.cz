import { EventExpenseTypeId } from "app/config/event-expense-types";
import { EventStatusID } from "app/config/event-statuses";
import { EventTypeID } from "app/config/event-types";
import { Document } from "./api-document";
import { Member } from "./member";

export interface EventExpense {
  id: string;
  amount: number;
  type: EventExpenseTypeId;
  description: string;
  photo?: string;
}

export type EventLinks = "registration" | "announcement" | "announcement-template" | "accounting" | "accounting-template";
export type EventActions = "publish" | "unpublish" | "uncancel" | "cancel" | "reject" | "submit" | "lead";

export interface Event extends Document<EventLinks, EventActions> {

  _id: string;
  status: EventStatusID;
  statusNote: string;

  name: string;
  type: string;
  subtype: EventTypeID;
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