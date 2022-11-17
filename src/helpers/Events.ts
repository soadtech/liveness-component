export default class Events {
  static cameraModule;
  static init(element) {
    this.cameraModule = element;
  }
  static captureEvent(photos) {
    this.cameraModule.dispatchEvent(
      new CustomEvent("capture", {
        detail: {
          photos
        },
        bubbles: true,
        cancelable: true,
        composed: true
      })
    );
  };
  static closeEvent() {
    this.cameraModule.dispatchEvent(
      new CustomEvent("close", {
        bubbles: false,
        cancelable: true,
        composed: true
      })
    );
  };
  static cameraReadyEvent() {
    this.cameraModule.dispatchEvent(
      new CustomEvent("cameraReady", {
        bubbles: false,
        cancelable: true,
        composed: true
      })
    );
  };
  static errorEvent(error) {
    this.cameraModule.dispatchEvent(
      new CustomEvent("error", {
        detail: {
          error
        },
        bubbles: true,
        cancelable: true,
        composed: true
      })
    );
  }
  static detectionError(error) {
    this.cameraModule.dispatchEvent(
      new CustomEvent("detectionError", {
        detail: {
          error
        },
        bubbles: true,
        cancelable: true,
        composed: true
      })
    );
  }
  static loadedModels(loadedModels) {
    this.cameraModule.dispatchEvent(
      new CustomEvent("loadedModels", {
        detail: {
          loadedModels
        },
        bubbles: true,
        cancelable: true,
        composed: true
      })
    );
  }
  static detectorInitialized(initializationTime: number) {
    this.cameraModule.dispatchEvent(
      new CustomEvent("detectorInitialized", {
        detail: {
          initializationTime
        },
        bubbles: true,
        cancelable: true,
        composed: true
      })
    );
  }
}
