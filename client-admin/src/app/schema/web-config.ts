// @ts-nocheck
import { Contact } from "./contact";

export interface WebConfig {

  general: {
    title: string,
    homeMapUrl: string,
    campMapUrl: string,
    canalFormUrl: string,
    canalAttendeesUrl: string,
    documentsUrl: string;
  };

  contacts: {
    leaders: Contact[],
    monday: Contact[],
    wednesday: Contact[];
  };

}