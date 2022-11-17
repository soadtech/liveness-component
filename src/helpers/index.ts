import {Device} from "../IDevice";

export const initDevice = (): Device => {
  let device: Device = {
    isMobile: false,
    isAndroid: false,
    isLinux: false,
    isMac: false,
    isWin: false,
    isChrome: false,
    isFirefox: false,
    isSafari: false,
    isIos: false
  };
  device.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
    navigator.userAgent
  );
  device.isAndroid = /Android/i.test(navigator.userAgent);
  device.isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  device.isLinux = /linux/i.test(navigator.platform);
  device.isMac = /mac/i.test(navigator.platform);
  device.isWin = /win/i.test(navigator.platform);
  device.isChrome = /chrome/i.test(navigator.userAgent);
  device.isFirefox = /firefox/i.test(navigator.userAgent);
  device.isSafari = !device.isChrome
    ? /safari/i.test(navigator.userAgent)
    : false;
  device.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
    navigator.userAgent
  );
  device.isAndroid = /Android/i.test(navigator.userAgent);
  device.isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (!device.isIos) {
    const isIPad = navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2;
    if (isIPad) {
      device.isIos = true;
      device.isMobile = true;
    }
  }

  return device
};

export const getConstraints = (isMac: boolean) => {
  return isMac?
    {
    audio: false,
    video: {
      facingMode: "user",
      width: 1280,
      height: 720
    }
  } : {
    audio: false,
    video: {
      facingMode: "user",
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    }
  }
};

export const convertToDataUrl = async (file: any[]) => {

  return new Promise(async (resolve) => {
    let arr = [];
    for (let i = 0; i < file.length; i++) {
      const fr = new FileReader();
      fr.onload = () => {
        arr.push(fr.result);

        if(arr.length === file.length)
          resolve(arr);
      };

      fr.readAsDataURL(file[i]);
    }
  });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}
