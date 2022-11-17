import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import Events from "../../helpers/Events";
import base64Photo from "../../assets/photoToStartTheDetector";
import { PipelineResultImpl } from "./PipelineResult";
import { getVideoRatio } from "../../helpers/canvas";
import { HeadPosition } from "./HeadPosition";
import { initDevice } from "../../helpers";
// @ts-ignore
const cv = window.cv;
export class Detector {
  constructor(stream, isMobile, modelPath) {
    this.probabilityThreshold = 50;
    this.counterSuccessfulResults = 0;
    this.MAX_FPS_DETECTION = 1000 / 5;
    this.rendering = {
      now: 0,
      elapsed: 0,
      then: 0,
    };
    this.MAX_NUMBER_FACES = 1;
    this.MAX_ANGLE_TURN_HEAD = 30;
    this.MIN_FACE_SIZE_FOR_MOBILE = 224;
    this.MIN_FACE_SIZE_FOR_DESKTOP = 350;
    this.MIN_OCCUPIED_SPACE_FOR_DESKTOP = 15;
    this.MIN_OCCUPIED_SPACE_FOR_MOBILE = 15;
    this.X_OFFSET_FROM_FRAME = 15;
    this.Y_OFFSET_FROM_FRAME = 5;
    this.DEFAULT_NUMBER_SUCCESSFUL_RESULTS_FOR_AUTO_CAPTURING = 5;
    this.videoRatio = 1;
    this.showDetectedFace = false;
    this.headTurnCounter = 0;
    this.counterSuccessfulHeadTurns = 0;
    this.stream = stream;
    this.isMobile = isMobile;
    this.modelPath = modelPath;
  }
  setProbabilityThreshold(val) {
    this.probabilityThreshold = val;
  }
  static getInstance(stream, isMobile, modelPath) {
    if (!Detector.instance) {
      Detector.instance = new Detector(stream, isMobile, modelPath);
    }
    return Detector.instance;
  }
  updateHtmlElements(videoElement) {
    this.videoElement = videoElement;
  }
  static async initDetector(modelPath) {
    await faceapi.tf.setBackend(this.BACKEND);
    await faceapi.tf.enableProdMode();
    await faceapi.tf.ENV.set('DEBUG', false);
    await faceapi.tf.ready();
    await this.loadingModels(modelPath);
    if (!cv)
      console.error("open cv not found");
    Events.loadedModels({
      tinyFaceDetectorLoaded: faceapi.nets.tinyFaceDetector.isLoaded,
      faceLandmark68TinyNetLoaded: faceapi.nets.faceLandmark68TinyNet.isLoaded
    });
    const startTime = performance.now();
    await this.warmingUpModels();
    Events.detectorInitialized(performance.now() - startTime);
  }
  static async loadingModels(modelPath) {
    if (!this.modelsLoaded()) {
      await faceapi.nets.tinyFaceDetector.load(modelPath);
      await faceapi.nets.faceLandmark68TinyNet.load(modelPath);
    }
  }
  static modelsLoaded() {
    return faceapi.nets.tinyFaceDetector.isLoaded && faceapi.nets.faceLandmark68TinyNet.isLoaded;
  }
  static async warmingUpModels() {
    const image = new Image();
    image.src = base64Photo;
    await this.detectAllFaces(image);
  }
  static async detectAllFaces(src) {
    faceapi.tf.engine().startScope();
    let result = [];
    try {
      let input = src;
      if (this.isIos && src instanceof HTMLVideoElement) {
        const canvas = document.createElement('canvas');
        const width = 480;
        const height = 640;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        context.drawImage(src, 0, 0, width, height);
        input = canvas;
      }
      result = await faceapi
        .detectAllFaces(input, this.tinyFaceDetectorOptions)
        .withFaceLandmarks(true);
    }
    catch (e) {
      // bug in face api with canvas context 2d
    }
    finally {
      faceapi.tf.engine().endScope();
    }
    return result;
  }
  async startDetector() {
    if (!this.videoElement)
      throw Error("Video element not found");
    if (this.videoElement.clientWidth === 0)
      throw Error("Video element too small");
    this.rendering.then = Date.now();
    this.counterSuccessfulResults = 0;
    this.updateForIos();
    this.videoRatio = getVideoRatio(this.videoElement);
    if (!Detector.modelsLoaded()) {
      await Detector.initDetector(this.modelPath);
    }
    this.requestAnimationFrame = requestAnimationFrame(() => this.detection());
  }
  stopDetector() {
    if (this.requestAnimationFrame) {
      // @ts-ignore
      cancelAnimationFrame(this.requestAnimationFrame); // TODO
      this.requestAnimationFrame = undefined;
      if (this.innerCanvas)
        this.innerCanvas.remove();
      this.innerCanvas = undefined;
    }
  }
  updateForIos() {
    const device = initDevice();
    if (device.isIos) {
      this.DEFAULT_NUMBER_SUCCESSFUL_RESULTS_FOR_AUTO_CAPTURING = 3;
      this.MAX_FPS_DETECTION = 1000 / 2;
      Detector.isIos = true;
    }
  }
  async detection() {
    this.requestAnimationFrame = requestAnimationFrame(() => this.detection());
    this.rendering.now = Date.now();
    this.rendering.elapsed = this.rendering.now - this.rendering.then;
    if (this.rendering.elapsed > this.MAX_FPS_DETECTION) {
      this.rendering.then = this.rendering.now - (this.rendering.elapsed % this.MAX_FPS_DETECTION);
      const detectionResult = await Detector.detectAllFaces(this.videoElement);
      if (this.showDetectedFace || Detector.debug)
        this.drawFaces();
      const faceErrors = await this.checkDetectedFaceOnError(detectionResult);
      if (Object.values(faceErrors).every(v => !v)) {
        this.counterSuccessfulResults++;
        this.autoCapturing();
      }
      else {
        this.counterSuccessfulResults = 0;
        this.stream.returnErrors(faceErrors);
      }
    }
  }
  async checkDetectedFaceOnError(detectedFaces) {
    const detectionFacesForSize = faceapi.resizeResults(detectedFaces, {
      width: this.videoElement.videoWidth,
      height: this.videoElement.videoHeight,
    });
    const pipelineResults = new PipelineResultImpl();
    const faceDetection = this.checkNumberFaces(detectionFacesForSize);
    pipelineResults["FACE_NOT_FOUND"] = !faceDetection && detectionFacesForSize.length === 0;
    pipelineResults["TOO_MANY_FACES"] = !faceDetection && detectionFacesForSize.length > this.MAX_NUMBER_FACES;
    if (faceDetection) {
      if (cv)
        pipelineResults["FACE_ANGLE_TOO_LARGE"] = !this.checkHeadRotation(detectionFacesForSize);
      pipelineResults["PROBABILITY_TOO_SMALL"] = !this.checkProbability(detectionFacesForSize);
      pipelineResults["FACE_TOO_SMALL"] = !this.checkFaceSize(detectionFacesForSize);
      pipelineResults["FACE_CLOSE_TO_BORDER"] = !this.checkFaceIndent(detectionFacesForSize);
    }
    return pipelineResults;
  }
  autoCapturing() {
    if (Detector.debug)
      console.info(this.counterSuccessfulResults);
    if (this.counterSuccessfulResults >= this.DEFAULT_NUMBER_SUCCESSFUL_RESULTS_FOR_AUTO_CAPTURING) {
      this.stream.autoCapturing();
      this.counterSuccessfulResults = 0;
    }
  }
  // @ts-ignore TODO
  checkNumberFaces(detectionResult) {
    return detectionResult.length === this.MAX_NUMBER_FACES;
  }
  // @ts-ignore TODO
  checkProbability(detectionResult) {
    const score = detectionResult[0].detection.score;
    return score > +this.probabilityThreshold / 100;
  }
  // @ts-ignore TODO
  checkFaceSize(detectionResult) {
    const faceBox = detectionResult[0].detection.box;
    const { width, height, area } = faceBox;
    const { imageHeight, imageWidth } = detectionResult[0].detection;
    const occupiedSize = 100 / ((imageHeight * imageWidth) / area);
    const minSide = Math.min(width / this.videoRatio, height / this.videoRatio);
    return (minSide > (this.isMobile ? this.MIN_FACE_SIZE_FOR_MOBILE : this.MIN_FACE_SIZE_FOR_DESKTOP) &&
      occupiedSize > (this.isMobile ? this.MIN_OCCUPIED_SPACE_FOR_MOBILE : this.MIN_OCCUPIED_SPACE_FOR_DESKTOP));
  }
  // @ts-ignore TODO
  checkFaceIndent(detectionResult) {
    const faceBox = detectionResult[0].detection.box;
    const { imageHeight, imageWidth } = detectionResult[0].detection;
    const { top, left, bottom, right } = faceBox;
    const topIndent = top;
    const leftIndent = left;
    const rightIndent = imageWidth - right;
    const bottomIndent = imageHeight - bottom;
    return !(topIndent < this.Y_OFFSET_FROM_FRAME ||
      leftIndent < this.X_OFFSET_FROM_FRAME ||
      rightIndent < this.X_OFFSET_FROM_FRAME ||
      bottomIndent < this.Y_OFFSET_FROM_FRAME);
  }
  // @ts-ignore TODO
  checkHeadRotation(detectionResult) {
    const temporaryCanvas = document.createElement("canvas");
    const dims = faceapi.matchDimensions(temporaryCanvas, this.videoElement, true);
    temporaryCanvas.remove();
    const headPosition = new HeadPosition(detectionResult[0].landmarks.positions, dims);
    let angles = [0, 0, 0];
    try {
      angles = headPosition.estimateHeadPose();
    }
    catch (e) {
      // some error with open cv
    }
    if (angles[2] > this.MAX_ANGLE_TURN_HEAD || angles[2] * -1 > this.MAX_ANGLE_TURN_HEAD) {
      this.headTurnCounter++;
    }
    else {
      this.counterSuccessfulHeadTurns++;
      if (this.counterSuccessfulHeadTurns >= 5) {
        this.headTurnCounter = 0;
        this.counterSuccessfulHeadTurns = 0;
      }
    }
    return this.headTurnCounter <= 1;
  }
  drawFaces() {
    if (!this.innerCanvas) {
      this.createCanvasForDrawingMask(this.videoElement);
    }
    const canvas = this.innerCanvas;
    if (!canvas)
      return console.error("no canvas for drawing");
    const ctx = canvas.getContext('2d');
    if (!ctx)
      return;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // // draw title
    // ctx.font = 'small-caps 20px "Segoe UI"';
    // ctx.fillStyle = 'white';
    // for (const person of data) {
    //   ctx.lineWidth = 3;
    //   ctx.strokeStyle = 'deepskyblue';
    //   ctx.fillStyle = 'deepskyblue';
    //   ctx.globalAlpha = 0.6;
    //   ctx.beginPath();
    //   // ctx.rect(person.detection.box.x, person.detection.box.y, person.detection.box.width, person.detection.box.height);
    //   // ctx.stroke();
    //   ctx.globalAlpha = 1;
    //   ctx.globalAlpha = 0.8;
    //   ctx.fillStyle = 'lightblue';
    //   const pointSize = 2;
    //   for (let i = 0; i < person.landmarks.positions.length; i++) {
    //     ctx.beginPath();
    //     ctx.arc(person.landmarks.positions[i].x, person.landmarks.positions[i].y, pointSize, 0, 2 * Math.PI);
    //     ctx.fill();
    //   }
    // }
  }
  createCanvasForDrawingMask(video) {
    this.innerCanvas = document.createElement("canvas");
    this.innerCanvas.className = "canvas-on-video";
    this.innerCanvas.width = video.videoWidth;
    this.innerCanvas.height = video.videoHeight;
    this.videoElement.after(this.innerCanvas);
    if (this.innerCanvas.offsetWidth) {
      this.innerCanvas.setAttribute("style", `margin-left:${-(this.innerCanvas.offsetWidth / 2)}px; margin-top: ${-(this.innerCanvas.offsetHeight / 2)}px;`);
    }
  }
}
Detector.tinyFaceDetectorOptions = new faceapi.TinyFaceDetectorOptions({ inputSize: 192 });
Detector.BACKEND = 'webgl';
Detector.debug = false;
