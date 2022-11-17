export function videoRatio(videoElement: HTMLVideoElement): number {
  const hRatio = videoElement.clientWidth / videoElement.videoWidth;
  const vRatio = videoElement.clientHeight / videoElement.videoHeight;
  return Math.min(hRatio, vRatio);
}

export function getVideoRatio(videoElement: HTMLVideoElement): number {
  const hRatio = videoElement.clientWidth / videoElement.videoWidth;
  const vRatio = videoElement.clientHeight / videoElement.videoHeight;
  return Math.min(hRatio, vRatio);
}
