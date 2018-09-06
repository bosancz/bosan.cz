export class Photo {
  
  _id:string;
  
  album:string;
  
  name:string;
  
  width:number;
  height:number;
  
  caption?:string;
  
  sizes:{
    original: {width:number,height:number,url:string},
    big: {width:number,height:number,url:string},
    small: {width:number,height:number,url:string}
  };
  
  bg:string;
  
  tags:string[];
  
  date:Date;
  
  shareUrl?:string;
  
}