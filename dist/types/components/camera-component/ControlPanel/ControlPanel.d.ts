import { EventEmitter } from '../../../stencil-public-runtime';
export declare class ControlPanel {
  mobile: boolean;
  disableControlPanel: boolean;
  cameraStatus: number;
  resolutionOnPhoto: boolean;
  mobileMakePhoto: boolean;
  faceDetection: boolean;
  eventOpenCamera: EventEmitter;
  eventCloseCamera: EventEmitter;
  eventMakePhoto: EventEmitter;
  eventRetakePhoto: EventEmitter;
  eventTakePhoto: EventEmitter;
  makePhoto: () => void;
  closeCamera: () => void;
  openCamera: () => void;
  takePhoto: () => void;
  retakePhoto: () => Promise<void>;
  render(): any;
}
