// @ts-nocheck
import { Contact } from "./contact";

export class WebConfigAchievement {
  id: string;
  name: string;
  image: string;
}

export class WebConfigEventExpenseType {
  name: string;
}

export class WebConfigRecurringType {
  name: string;
  title: string;
}

export class WebConfigDescriptionWarning {
  regexp: string;
  regexpModifiers: string;
  text: string;
}

export interface WebConfig {

  general: {
    title: string,
    environment: string,
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

  events: {
    expenseTypes: WebConfigEventExpenseType[],
    recurringTypes: WebConfigRecurringType[],
    descriptionWarnings: WebConfigDescriptionWarning[];
  };

}