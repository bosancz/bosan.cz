import { MemberGroupID } from "app/config/member-groups";
import { MemberRoleID } from "app/config/member-roles";
import { MembershipTypeID } from "app/config/membership-types";
import { Document } from "./api-document";

export interface Member extends Document {
  _id: string;

  group: MemberGroupID;
  role: MemberRoleID;
  post: string;
  membership: MembershipTypeID;
  inactive: boolean;

  rank: string;
  stars: string;

  nickname?: string;

  name?: {
    first: string,
    last: string;
  };

  birthday?: string;

  address: {
    street: string,
    streetNo: string,
    city: string,
    postalCode: string,
    country: string;
  };

  contacts?: {
    mobile: string,
    email: string,
    mother: string,
    father: string;
  };

  achievements: [{
    id: string,
    dateFrom: Date,
    dateTill: Date;
  }];

  allergies?: string[];
  allergiesDate: string | Date;

  faceDescriptor?: number[];
}