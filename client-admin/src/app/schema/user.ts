export interface UserNotification {
  email: boolean;
  system: boolean;
}

export interface User {

  _id: string;
  login: string;
  member: any;
  roles: string[];
  active: boolean;

  email: string;

  notifications: UserNotification[];

  _links?: any;
}