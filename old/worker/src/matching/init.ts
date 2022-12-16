// import nodejs bindings to native tensorflow,
// not required, but will speed up things drastically (python required)
import '@tensorflow/tfjs-node';

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';
import { faceDetectionNet } from "../config/faceDetection";

import path from "path";

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement
const { Canvas, Image, ImageData } = canvas

faceapi.env.monkeyPatch({
  Canvas: <unknown>Canvas as { new(): HTMLCanvasElement; prototype: HTMLCanvasElement; },
  Image: <unknown>Image as { new(): HTMLImageElement; prototype: HTMLImageElement; },
  ImageData
});

export async function matchingInit() {
  console.log("Loading models...");

  await faceDetectionNet.loadFromDisk(path.join(__dirname, "../../ml-models"));
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, "../../ml-models"));
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, "../../ml-models"));
  await faceapi.nets.faceExpressionNet.loadFromDisk(path.join(__dirname, "../../ml-models"));
}