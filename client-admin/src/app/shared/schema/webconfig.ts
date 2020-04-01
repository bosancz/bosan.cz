
import { Contact } from "./contact";

export class WebConfigGroup {
  id: string;
  name: string;
  color: string;
  real: boolean;
  active: boolean;
  event: boolean;
  children: boolean;
}

export class WebConfigAchievement {
  id: string;
  name: string;
  image: string;
}

export class WebConfigEventStatus {
  id: string;
  name: string;
  class: string;
}

export class WebConfigEventType {
  name: string;
  class: string;
}

export class WebConfigEventSubType {
  name: string;
  color: string;
  image?: string;
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

export class WebConfigMemberRole {
  id: string;
  genitiv: string;
}

export interface WebConfigMemberPost {
  id: string;
}

export interface WebConfigMemberRank {
  id: string;
}


export class WebConfigMembershipType {
  id: string;
}

export interface WebConfigUserRole {
  name: string;
  title: string;
  desription: string
}

export interface WebConfig {

  general: {
    title: string,
    environment: string,
    homeMapUrl: string,
    campMapUrl: string,
    documentsUrl: string,
  };

  users: {
    roles: WebConfigUserRole[]
  };

  contacts: {
    leaders: Contact[],
    monday: Contact[],
    wednesday: Contact[]
  };

  members: {
    roles: WebConfigMemberRole[],
    posts: WebConfigMemberPost[],
    ranks: WebConfigMemberRank[],
    groups: WebConfigGroup[],
    membershipTypes: WebConfigMembershipType[],
    achievements: WebConfigAchievement[]
  };

  canal: {
    formUrl: string,
    attendeesUrl: string
  };

  events: {
    statuses: WebConfigEventStatus[],
    types: WebConfigEventType[],
    subtypes: WebConfigEventSubType[],
    expenseTypes: WebConfigEventExpenseType[],
    recurringTypes: WebConfigRecurringType[],
    descriptionWarnings: WebConfigDescriptionWarning[]
  };

  payments: {
    types: Array<{ name: string }>
  };
}