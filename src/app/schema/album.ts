export class Album {
  _id:string;
  name:string;
  year:number;
  titlePhoto:string;
  photos:AlbumPhoto[]
}

export class AlbumPhoto {
  
  url:string;
  thumbnailUrl:string;
  
  width:number;
  height:number;
  
  caption?:string;
  
}