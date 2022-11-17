import { PipelineResult } from "../../../libs/FaceDetector/PipelineResult";
import { Device } from "../../../IDevice";
import { EventEmitter } from "../../../stencil-public-runtime";
export declare class Camera {
  showMask: boolean;
  modelPath: string;
  device: Device;
  probabilityThreshold: number;
  faceDetection: boolean;
  private cameraVideo;
  private cameraCanvas;
  eventVideoStarted: EventEmitter;
  eventCloseCamera: EventEmitter;
  errorCameraEvent: any;
  eventMakePhoto: EventEmitter;
  eventTakePhoto: EventEmitter;
  componentDidLoad(): void;
  render(): any;
  callbackErrors: (error: Error, isError: boolean) => void;
  callbackAutoCapturing: () => void;
  callbackFaceDetectionErrors: (e: PipelineResult) => void;
  startStream(): void;
}
