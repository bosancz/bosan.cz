
import { connect, disconnect } from "./db";

import { PhotoModel } from "./models/photo";
import { MemberModel } from "./models/member";

import path from "path";
import { LabeledFaceDescriptors } from "face-api.js";
import { Photo } from "./schema/photo";
import { Readable, Transform, TransformCallback, Writable } from "stream";
import { matchingInit, recognizeFaces, matchFace } from "./matching";
import { photosDir } from "./config/photos";
import { pathExists } from "fs-extra";
import { Face } from "./schema/face";

const databaseUri = process.env["DATABASE_URI"] || "mongodb://localhost:27017/bosan-test";

(async function () {

  console.log("Connecting to database...");
  if (!databaseUri) throw new Error("DATABASE_URI not specified.");

  await connect(databaseUri)

  process.stdout.write(`Loading members descriptors...\r`)

  const membersDescriptors: LabeledFaceDescriptors[] = (await MemberModel.find({ faceDescriptor: { $exists: true } }).select("_id faceDescriptor").lean())
    .map(member => new LabeledFaceDescriptors(member._id, [member.faceDescriptor]));

  process.stdout.write(`Loading members descriptors...${membersDescriptors.length}\r\n`)

  const photoCount: number = await PhotoModel.find({ faces: { $exists: false } }).countDocuments();
  const photoStream: Readable = PhotoModel.find({ faces: { $exists: false } }).select("_id album sizes.big.file").lean().stream();

  let c = 0;

  const appendFacesStream = new Writable({

    objectMode: true,

    async write(photo: Photo, encoding: string, callback: (err?: Error | null) => void) {

      try {

        c++;

        const photoPath = path.join(photosDir, String(photo.album), photo.sizes.big.file)

        console.log(`Image ${c}/${photoCount}:`, photoPath);



        let faces: Face[] = []

        if (await pathExists(photoPath)) {

          process.stdout.write(`Recognizing faces...\r`);
          const faces = await recognizeFaces(photoPath);
          process.stdout.write(`Recognizing faces...${faces.length}\r\n`);

          process.stdout.write(`Matching faces...\r`);
          if (membersDescriptors.length) {
            for (let face of faces) {
              const match = matchFace(face.descriptor, membersDescriptors);
              if (match) face.match = { member: match.label, distance: match.distance };
            }
          }
          process.stdout.write(`Matching faces...${faces.filter(f => !!f.match).length}/${faces.length}\r\n`);
        }
        else {
          console.log("File not found.")
        }


        process.stdout.write("Writing photo...\r");
        await PhotoModel.updateOne({ _id: photo._id }, { faces })
        process.stdout.write("Writing photo...OK\r\n");

        callback();

      }
      catch (err) {
        console.log("Error:", err.message);
        callback();
      }


    },
  });

  await matchingInit();

  console.log("Starting...")

  await new Promise((resolve, reject) => {
    photoStream.pipe(appendFacesStream);

    appendFacesStream.on("finish", () => resolve())
    appendFacesStream.on("error", () => reject())
  });

  await disconnect();
})()