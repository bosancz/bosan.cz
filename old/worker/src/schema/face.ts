
export interface Face {
  
  score: number;
  
  rectangle: {
    x: number,
    y: number,
    width: number,
    height: number,
  };
  
  descriptor: Float32Array;
  
  match?: {
    member: string,
    distance: number,
  }

}