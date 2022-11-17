import mask from "../assets/mask.svg";
import Events from "./Events";
import { Detector } from "../libs/FaceDetector/Detector";
import { PipelineResult } from "../libs/FaceDetector/PipelineResult";
import { addExifInImg } from "./security";
import { Device } from "../IDevice";

const img = new Image();
img.src = mask;

enum ImageFormat {
  JPEG = "image/jpeg",
  PNG = "image/png",
}

export class Stream {
  public static instance: Stream;
  private videoElement: HTMLVideoElement;
  private canvasElement: HTMLCanvasElement;
  private stream: MediaStream;
  private faceDetection: boolean;
  private showMask = false;
  private device: Device;
  private videoSize = { width: 0, height: 0 };
  private readonly detector: Detector;
  private callbackErrors: (error: Error, isError: boolean) => void;
  private callbackAutoCapturing: () => void;
  private callbackFaceDetectionErrors: (e: PipelineResult) => void;
  private streamPaused = false;

  public setShowMask(val: boolean): void {
    this.showMask = val;
  }

  public setFaceDetection(val: boolean): void {
    this.faceDetection = val;
  }

  public setProbabilityThreshold(val: number): void {
    Detector.getInstance().setProbabilityThreshold(val);
  }
  public setCallbackErrors(
    fun: (error: Error, isError: boolean) => void
  ): void {
    this.callbackErrors = fun;
  }
  public setCallbackAutoCapturing(fun: () => void): void {
    this.callbackAutoCapturing = fun;
  }
  public setCallbackFaceDetectionErrors(
    fun: (e: PipelineResult) => void
  ): void {
    this.callbackFaceDetectionErrors = fun;
  }

  private constructor(device: Device, modelPath: string) {
    this.device = device;
    this.detector = Detector.getInstance(this, device.isMobile, modelPath);
  }

  public static getInstance(device?: Device, modelPath?: string): Stream {
    if (!Stream.instance) {
      Stream.instance = new Stream(device, modelPath);
    }

    return Stream.instance;
  }

  public returnErrors(errors: PipelineResult) {
    this.callbackFaceDetectionErrors(errors);
  }

  public autoCapturing() {
    this.callbackAutoCapturing();
  }

  public updateHtmlElements(
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ) {
    this.videoElement = videoElement;
    this.canvasElement = canvasElement;
    this.detector.updateHtmlElements(videoElement);
  }

  public async startDetection(): Promise<void> {
    return this.detector.startDetector();
  }

  public static orientationChange() {
    if (Stream.instance) Stream.getInstance().drawMask();
  }

  public startStream(stream: MediaStream): void {
    if (this.stream)
      this.stream.getTracks().forEach((track: any) => track.stop());
    this.stream = stream;

    if ("srcObject" in this.videoElement) {
      this.videoElement.srcObject = stream;
    } else {
      // @ts-ignore
      this.videoElement.src = window.URL.createObjectURL(stream);
    }

    this.videoElement.play().then(() => {
      this.streamPaused = false;
      Events.cameraReadyEvent();

      this.drawMask();

      if (this.faceDetection) this.startDetection();
    });
  }

  public async initStream(stream: MediaStream): Promise<void> {
    this.startStream(stream);
  }

  public pauseStream = () => {
    this.streamPaused = true;
    this.videoElement.pause();
    this.dropMask();
    if (this.faceDetection) Detector.getInstance().stopDetector();
  };

  public async resumeStream(): Promise<void> {
    this.streamPaused = false;
    await this.videoElement.play();
    this.drawMask();
    if (this.faceDetection) await Detector.getInstance().startDetector();
  }

  private updateCanvasSize(canvas: HTMLCanvasElement): void {
    this.videoSize = {
      width: this.videoElement.videoWidth,
      height: this.videoElement.videoHeight,
    };
    canvas.width = this.videoSize.width;
    canvas.height = this.videoSize.height;
  }

  public dropStream(): void {
    if (!this.streamStopped()) {
      this.stream.getTracks().forEach((track: any) => track.stop());
      this.videoElement.srcObject = null;
    }
    if (this.faceDetection) Detector.getInstance().stopDetector();
  }

  private streamStopped(): boolean {
    return !(
      this.stream &&
      this.stream.getTracks &&
      this.stream.getTracks().length > 0
    );
  }

  public drawElipse(ctx, x, y, w, h, color, width) {
    var kappa = 0.5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w, // x-end
      ye = y + h, // y-end
      xm = x + w / 2, // x-middle
      ym = y + h / 2; // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    //ctx.closePath(); // not used correctly, see comments (use to close off open path)
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  public drawBackground(ctx, x, y, w, h) {
    this.drawElipse(ctx, x, y, w, h, "rgba(0, 0, 0, 0.5)", 1000);
  }

  private drawMask(): void {
    if (this.showMask && !this.streamPaused) {
      setTimeout(() => {
        this.updateCanvasSize(this.canvasElement);
        const canvas = this.canvasElement;
        const canvasCtx = canvas.getContext("2d");

        const height = innerHeight;
        // const width = innerWidth;

        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
          navigator.userAgent
        );

        //Background
        if (isMobile) {
          this.drawBackground(
            canvasCtx,
            -canvas.width / 2.7,
            -canvas.height / 12.5,
            canvas.width * 1.7,
            canvas.height
          );
          this.drawElipse(
            canvasCtx,
            canvas.width / 3.5,
            canvas.height / 5.5,
            canvas.width / 2.5,
            canvas.height / 2.3,
            "#007399",
            5
          );
        }else{
          this.drawBackground(
            canvasCtx,
            -canvas.width / 11,
            -canvas.height / 3.83,
            canvas.width * 1.17,
            canvas.height + height / 2.5
          );
          this.drawElipse(
            canvasCtx,
            canvas.width / 3.4,
            canvas.height / 4.5,
            canvas.width / 2.5,
            canvas.height / 1.8,
            "#007399",
            5
          );
        }
        

        //Draw the svg mask
        // const hRatio = canvas.width / img.width;
        // const vRatio = canvas.height / img.height;
        // const ratio = Math.min(hRatio, vRatio);

        // const portraitOrientation = canvas.width < canvas.height;
        // const paddingX =
        //   !portraitOrientation && this.device.isMobile ? 50 : 100;
        // const paddingY = portraitOrientation ? 200 : 100;
        // const centerShift_x = (canvas.width - img.width * ratio) / 2;
        // const centerShift_y = (canvas.height - img.height * ratio) / 2;
        // canvasCtx.drawImage(
        //   img,
        //   0,
        //   0,
        //   img.width,
        //   img.height,
        //   centerShift_x + paddingX,
        //   centerShift_y + paddingY,
        //   img.width * ratio - paddingX * 2,
        //   img.height * ratio - paddingY * 2
        // );
      }, 150);
    }
  }

  private dropMask() {
    const canvas = this.canvasElement;
    const canvasCtx = canvas.getContext("2d");
    canvasCtx.clearRect(0, 0, 10000, 10000);
  }

  public takePhoto() {
    return new Promise(async (resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = this.videoElement.videoWidth;
      canvas.height = this.videoElement.videoHeight;

      resolve([await this.getFrame(canvas)]);
    });
  }

  public getFrame(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve) => {
      const context = canvas.getContext("2d");
      context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (frame: Blob) => {
          if (frame.type === ImageFormat.JPEG && !this.device.isIos) {
            try {
              addExifInImg(
                frame,
                this.stream.getTracks()[0],
                this.videoSize
              ).then((updatedFrame) => resolve(updatedFrame));
            } catch (e) {
              resolve(frame);
              this.callbackErrors(e, false);
            }
          } else {
            resolve(frame);
          }
        },
        ImageFormat.PNG,
        1
      );
    });
  }
}

window.addEventListener("resize", Stream.orientationChange, false);
window.addEventListener("orientationchange", Stream.orientationChange, false);
