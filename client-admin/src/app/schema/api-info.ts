import { Document, DocumentLink } from "./api-document";
import { ApiEndpoints } from "./api-endpoints";

export interface ApiInfo extends Document {

  name: string;
  description: string;

  _links: {
    [key in ApiEndpoints | "self"]: DocumentLink;
  };
}