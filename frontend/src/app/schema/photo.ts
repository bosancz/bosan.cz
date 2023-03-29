import { Face } from "./face";

export interface Photo {

  _id: string;

  album: string;

  name: string;

  width: number;
  height: number;

  caption?: string;

  sizes: {
    original: { width: number, height: number, url: string; },
    big: { width: number, height: number, url: string; },
    small: { width: number, height: number, url: string; };
  };

  bg: string;

  tags: string[];

  faces: Face[];

  date: string;

  shareUrl?: string;

  uploadedBy?: { _id: string, login: string, member?: { name: string, nickname: string; }; };

}