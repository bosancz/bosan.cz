export class Member {
  _id:string;
  
  nickname:string;
  
  name:{
    first:string,
    last:string
  };
  
  group?:string;
  
  mobile?:string;
}