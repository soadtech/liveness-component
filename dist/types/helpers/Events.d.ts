export default class Events {
  static cameraModule: any;
  static init(element: any): void;
  static captureEvent(photos: any): void;
  static closeEvent(): void;
  static cameraReadyEvent(): void;
  static errorEvent(error: any): void;
  static detectionError(error: any): void;
  static loadedModels(loadedModels: any): void;
  static detectorInitialized(initializationTime: number): void;
}
