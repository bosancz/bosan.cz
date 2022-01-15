
export interface Face {

  rectangle: {
    x: number,
    y: number,
    width: number,
    height: number,
  };

  descriptor: Float32Array;

  expression?: string;

  member?: {
    _id: string;
    name: string,
    group: string,
  }  

}