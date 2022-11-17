import { blobToBase64 } from "./index";
import * as piexif from "piexifjs";
export const addExifInImg = async (blob, track, videoSize) => {
  const base64 = await blobToBase64(blob);
  const exif = piexif.load(base64);
  const devices = await navigator.mediaDevices.enumerateDevices();
  const cameraNames = devices.filter(device => device.kind === "videoinput").map(device => device.label);
  const json = {
    width: videoSize.width,
    height: videoSize.height,
    usedCamera: track.label,
    camerasOnDevice: cameraNames
  };
  const newExif = {
    "0th": Object.assign(Object.assign({}, exif["0th"]), { [piexif.ImageIFD.Model]: json.usedCamera, [piexif.ImageIFD.ImageWidth]: json.width, [piexif.ImageIFD.ImageLength]: json.height }),
    Exif: Object.assign(Object.assign({}, exif["Exif"]), { [piexif.ExifIFD.UserComment]: JSON.stringify(json) }),
    GPS: Object.assign({}, exif["GPS"]),
    Interop: Object.assign({}, exif["Interop"]),
    "1st": Object.assign({}, exif["1st"]),
    thumbnail: exif["thumbnail"]
  };
  const newExifBinary = piexif.dump(newExif);
  const newPhotoData = piexif.insert(newExifBinary, base64);
  return await fetch(newPhotoData).then(res => res.blob());
};
