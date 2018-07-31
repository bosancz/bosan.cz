export class Album {
  _id:string;
  year:number;
  
  name:string;
  description:string;
  
  published:Date;
  
  event:any;
  
  titlePhoto:Photo;
  photos:Photo[]
}

export class Photo {
  
  _id:string;
  
  width:number;
  height:number;
  
  caption?:string;
  
  sizes:{
    original: {width:number,height:number,url:string},
    big: {width:number,height:number,url:string},
    small: {width:number,height:number,url:string}
  };
  
  bg:string;
  
}