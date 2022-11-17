import { Device } from "../IDevice";
export declare const initDevice: () => Device;
export declare const getConstraints: (isMac: boolean) => {
  audio: boolean;
  video: {
    facingMode: string;
    width: number;
    height: number;
  };
} | {
  audio: boolean;
  video: {
    facingMode: string;
    width: {
      ideal: number;
    };
    height: {
      ideal: number;
    };
  };
};
export declare const convertToDataUrl: (file: any[]) => Promise<unknown>;
export declare const blobToBase64: (blob: Blob) => Promise<string>;
