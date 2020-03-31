import { Document } from "./api";

export class Member extends Document {
  _id: string;

  group: string;
  role: string;
  membership: string;
  inactive: boolean;

  nickname: string;

  name: {
    first: string,
    last: string
  };

  birthday: string;

  address: {
    street: string,
    streetNo: string,
    city: string,
    postalCode: string,
    country: string
  };

  contacts: {
    mobile: string,
    email: string,
    mother: string,
    father: string
  };

  achievements: [{
    id: string,
    dateFrom: Date,
    dateTill: Date
  }];

  allergies?: string[];
  allergiesDate: string | Date;

  faceDescriptor?: number[];
}