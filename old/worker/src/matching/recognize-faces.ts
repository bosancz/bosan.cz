import * as canvas from 'canvas';
import { detectAllFaces } from 'face-api.js';

import { faceDetectionOptions } from "../config/faceDetection";

import { Face } from '../schema/face';

export async function recognizeFaces(photoPath: string): Promise<Face[]> {

  const img = <unknown>(await canvas.loadImage(photoPath)) as HTMLImageElement;

  const detections = await detectAllFaces(img, faceDetectionOptions)
    .withFaceLandmarks()
    .withFaceDescriptors()
    .withFaceExpressions();

  const faces: Face[] = detections.map(detection => {

    const box: { x: number, y: number, width: number, height: number } = detection.alignedRect.box;
    const imageSize: { height: number, width: number } = detection.alignedRect.imageDims;

    return {
      score: detection.alignedRect.score,
      rectangle: {
        x: box.x / imageSize.width,
        y: box.y / imageSize.height,
        width: box.width / imageSize.width,
        height: box.height / imageSize.height
      },
      expressions: detection.expressions.asSortedArray,
      descriptor: detection.descriptor
    }
  });

  return faces;

}