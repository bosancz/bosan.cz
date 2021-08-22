import archiver from "archiver";

import config from "../../config";

export default function (albumId, res) {
  return new Promise((resolve, reject) => {
    const zip = archiver("zip");
    zip.on("error", (err) => reject(err));

    res.on("close", () => resolve());
    res.on("error", (err) => reject(err));

    const albumDir = config.photos.albumStorageDirFn(albumId);

    zip.pipe(res);

    zip.directory(albumDir, false);

    zip.finalize();
  });
}
