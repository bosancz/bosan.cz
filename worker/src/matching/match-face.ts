import { FaceMatcher, LabeledFaceDescriptors, FaceMatch } from 'face-api.js';

export function matchFace(needle: Float32Array, haystack: LabeledFaceDescriptors[]): FaceMatch {
  const faceMatcher = new FaceMatcher(haystack)

  return faceMatcher.findBestMatch(needle);

}