import { Stream } from "../../../helpers/Stream";
import Events from "../../../helpers/Events";
import { h } from "@stencil/core";
export class Camera {
  constructor() {
    this.callbackErrors = (error, isError) => {
      if (isError) {
        this.errorCameraEvent.emit(error);
        this.eventCloseCamera.emit();
      }
      else {
        this.errorCameraEvent.emit(error);
      }
    };
    this.callbackAutoCapturing = () => {
      if (this.device.isMobile) {
        this.eventMakePhoto.emit();
      }
      else {
        this.eventTakePhoto.emit();
      }
    };
    this.callbackFaceDetectionErrors = (e) => {
      Events.detectionError(e);
    };
    this.showMask = undefined;
    this.modelPath = undefined;
    this.device = undefined;
    this.probabilityThreshold = undefined;
    this.faceDetection = undefined;
  }
  componentDidLoad() {
    this.startStream();
  }
  render() {
    const cameraCSS = "camera " + (this.device.isMobile ? "cameraMobile" : "");
    return (h("div", { class: cameraCSS }, h("video", { loop: true, autoplay: true, playsinline: true, muted: true, class: "cameraVideo", ref: (el) => this.cameraVideo = el }), h("canvas", { class: "cameraCanvas", ref: (el) => this.cameraCanvas = el })));
  }
  startStream() {
    if (!Stream.instance)
      Stream.getInstance(this.device, this.modelPath);
    const stream = Stream.getInstance();
    stream.updateHtmlElements(this.cameraVideo, this.cameraCanvas);
    stream.setShowMask(this.showMask);
    stream.setFaceDetection(this.faceDetection);
    stream.setProbabilityThreshold(this.probabilityThreshold);
    stream.setCallbackErrors(this.callbackErrors);
    stream.setCallbackAutoCapturing(this.callbackAutoCapturing);
    stream.setCallbackFaceDetectionErrors(this.callbackFaceDetectionErrors);
  }
  static get is() { return "camera-comp"; }
  static get originalStyleUrls() {
    return {
      "$": ["camera.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["camera.css"]
    };
  }
  static get properties() {
    return {
      "showMask": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "show-mask",
        "reflect": false
      },
      "modelPath": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "model-path",
        "reflect": false
      },
      "device": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Device",
          "resolved": "Device",
          "references": {
            "Device": {
              "location": "import",
              "path": "../../../IDevice"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
      "probabilityThreshold": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "probability-threshold",
        "reflect": false
      },
      "faceDetection": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "face-detection",
        "reflect": false
      }
    };
  }
  static get events() {
    return [{
        "method": "eventVideoStarted",
        "name": "videoStarted",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "eventCloseCamera",
        "name": "closeCamera",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "errorCameraEvent",
        "name": "errorCamera",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "eventMakePhoto",
        "name": "makePhoto",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "eventTakePhoto",
        "name": "takePhoto",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }];
  }
}
