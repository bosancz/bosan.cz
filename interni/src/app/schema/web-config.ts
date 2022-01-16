export class WebConfigContact {
  name?: string;
  nickname?: string;
  avatar?: string;
  role?: string;
  email?: string;
  mobile?: string;
}

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
    leaders: WebConfigContact[],
    monday: WebConfigContact[],
    wednesday: WebConfigContact[];
  };

}