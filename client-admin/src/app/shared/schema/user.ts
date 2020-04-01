export class UserNotification {
  email: boolean;
  system: boolean;
}

export class User {

  _id: string;
  login: string;
  member: any;
  roles: string[];
  active: boolean;

  email: string;

  notifications

  _links?: any;
}