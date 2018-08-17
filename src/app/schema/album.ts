export class Album {
  _id:string;
  year:number;
  status:string;
  name:string;
  description:string;
  
  datePublished:Date;
  dateFrom:Date;
  dateTill:Date;
  
  event:any;
  
  titlePhoto:Photo;
  titlePhotos:Photo[];
  photos:Photo[]
}

export class Photo {
  
  _id:string;
  
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
  
}