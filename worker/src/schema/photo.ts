import { Face } from "./face";

export interface Photo {
  _id: string;

  album: string;

  sizes: {
    original: { width: number, height: number, file: string },
    big: { width: number, height: number, file: string },
    small: { width: number, height: number, file: string },
  };

  faces: Face[];
}