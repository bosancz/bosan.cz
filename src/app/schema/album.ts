export class Album {
  _id:string;
  year:number;
  
  name:string;
  description:string;
  
  published:Date;
  
  event:any;
  
  titlePhoto:AlbumPhoto;
  photos:AlbumPhoto[]
}

export class AlbumPhoto {
  
  _id:string;
  url:string;
  thumbnailUrl:string;
  
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