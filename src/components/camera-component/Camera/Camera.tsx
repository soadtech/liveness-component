import { Stream } from "../../../helpers/Stream";
import { PipelineResult } from "../../../libs/FaceDetector/PipelineResult";
import Events from "../../../helpers/Events";
import { Device } from "../../../IDevice";
import { Component, Event, EventEmitter, h, Prop } from "@stencil/core";

@Component({
  tag: 'camera-comp',
  styleUrl: 'camera.css'
})

export class Camera {
  @Prop() showMask: boolean;
  @Prop() modelPath: string;
  @Prop() device: Device;
  @Prop() probabilityThreshold: number;
  @Prop() faceDetection: boolean;
  private cameraVideo: HTMLVideoElement;
  private cameraCanvas: HTMLCanvasElement;

  @Event({
    eventName: 'videoStarted',
  }) eventVideoStarted: EventEmitter;

  @Event({
    eventName: 'closeCamera',
  }) eventCloseCamera: EventEmitter;

  @Event({
    eventName: 'errorCamera',
  }) errorCameraEvent

  @Event({
    eventName: 'makePhoto',
  }) eventMakePhoto: EventEmitter;

  @Event({
    eventName: 'takePhoto',
  }) eventTakePhoto: EventEmitter;

  componentDidLoad() {
      this.startStream();
  }

  render() {
    const cameraCSS = "camera " + (this.device.isMobile ? "cameraMobile" : "");

    return (
      <div class={cameraCSS}>
        <video
          loop
          autoplay
          playsinline
          muted
          class={"cameraVideo"}
          ref={(el) => this.cameraVideo = el}
        />
        <canvas class={"cameraCanvas"} ref={(el) => this.cameraCanvas = el} />
      </div>
    )
  }

  callbackErrors = (error: Error, isError: boolean) => {
    if (isError) {
      this.errorCameraEvent.emit(error);
      this.eventCloseCamera.emit();
    } else {
      this.errorCameraEvent.emit(error);
    }
  }

  callbackAutoCapturing = () => {
    if (this.device.isMobile) {
      this.eventMakePhoto.emit();
    } else {
      this.eventTakePhoto.emit();
    }
  }

  callbackFaceDetectionErrors = (e: PipelineResult) => {
    Events.detectionError(e);
  }

  startStream() {
    if (!Stream.instance)
      Stream.getInstance(
        this.device,
        this.modelPath,
      );

    const stream = Stream.getInstance();
    stream.updateHtmlElements(this.cameraVideo, this.cameraCanvas);
    stream.setShowMask(this.showMask);
    stream.setFaceDetection(this.faceDetection);
    stream.setProbabilityThreshold(this.probabilityThreshold);
    stream.setCallbackErrors(this.callbackErrors);
    stream.setCallbackAutoCapturing(this.callbackAutoCapturing);
    stream.setCallbackFaceDetectionErrors(this.callbackFaceDetectionErrors);
  }

}
