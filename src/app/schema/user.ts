export class User {
  
  _id:string;
  login:string;
  member:any;
  roles:string[];
  active:boolean;
  
  email:string;
  
  _links?:any;
}