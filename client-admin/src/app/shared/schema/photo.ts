import { Face } from "./face";

export class Photo {

  _id: string;

  album: string;

  name: string;

  width: number;
  height: number;

  caption?: string;

  sizes: {
    original: { width: number, height: number, url: string },
    big: { width: number, height: number, url: string },
    small: { width: number, height: number, url: string }
  };

  bg: string;

  tags: string[];

  faces: Face[];

  date: Date | string;

  shareUrl?: string;

}