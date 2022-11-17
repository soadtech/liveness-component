import { h } from '@stencil/core';
import Events from "../../../helpers/Events";
import { getConstraints, initDevice } from "../../../helpers";
import { Stream } from "../../../helpers/Stream";
import { Detector } from "../../../libs/FaceDetector/Detector";
// @ts-ignore
import logo from "./../../../assets/logo-min.png";
export class MyComponent {
  constructor() {
    this.updateState = () => {
      this._showMask = this.show_mask === "true";
      this._disable_control_panel = this.disable_control_panel === "true";
      this._face_detection = this.face_detection === "true";
      this._stopAfterCapturing = this.stop_after_capturing === "true";
      this._probabilityThreshold = this.probability_threshold ? +this.probability_threshold : 50;
      this.url_logo = this.url_logo ? this.url_logo : logo;
      this._debug = this.debug === "true";
      Detector.debug = this._debug;
    };
    this.photoIsReady = (photos) => {
      if (this._stopAfterCapturing)
        this.closeCamera();
      Events.captureEvent(photos);
    };
    this.enableButton = () => {
      this._resolutionOnPhoto = true;
    };
    this.url_logo = undefined;
    this.show_mask = undefined;
    this.background_color = undefined;
    this.disable_control_panel = undefined;
    this.stop_after_capturing = undefined;
    this.face_detection = undefined;
    this.model_path = undefined;
    this.probability_threshold = undefined;
    this.debug = undefined;
    this.logo_style = undefined;
    this._resolutionOnPhoto = undefined;
    this._cameraStatus = undefined;
    this._mobileMakePhoto = undefined;
    this._stopAfterCapturing = undefined;
    this._showMask = undefined;
    this._disable_control_panel = undefined;
    this._face_detection = undefined;
    this._probabilityThreshold = undefined;
    this._debug = undefined;
    this.video = undefined;
    this.canvas = undefined;
    this.updateState();
    this._cameraStatus = 0;
    this._resolutionOnPhoto = false;
    this._device = initDevice();
    this._mobile = this._device.isMobile;
    this._mobileMakePhoto = false;
  }
  videoStarted() {
    this._resolutionOnPhoto = true;
  }
  ;
  async retakePhoto() {
    this._mobileMakePhoto = false;
    await Stream.getInstance().resumeStream();
  }
  ;
  takePhoto() {
    Stream.getInstance()
      .takePhoto()
      .then(res => {
      this.photoIsReady(res);
    });
  }
  ;
  async openCamera() {
    this._cameraStatus = 1;
    const constraints = getConstraints(this._device.isMac);
    setTimeout(() => {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
        const superStream = Stream.getInstance();
        superStream.initStream(stream);
        this.videoStarted();
      })
        .catch((e) => {
        this.closeCamera();
        Events.errorEvent(e);
      });
    }, 100);
  }
  ;
  async loadModels(event) {
    await Detector.initDetector(event.detail.path);
  }
  ;
  errorCamera(error) {
    Events.errorEvent(error.detail.message);
  }
  ;
  closeCamera() {
    if (Stream.instance) {
      this._cameraStatus = 0;
      Events.closeEvent();
      Stream.getInstance().dropStream();
      this._mobileMakePhoto = false;
      this._resolutionOnPhoto = false;
    }
  }
  ;
  makePhoto() {
    if (this._mobile) {
      this._mobileMakePhoto = true;
      Stream.getInstance().pauseStream();
    }
    else {
      this.takePhoto();
    }
  }
  ;
  componentWillLoad() {
    Events.init(this.component);
    if (!navigator.mediaDevices) {
      Events.errorEvent("This browser does not support webRTC");
    }
  }
  componentDidUpdate() {
    this.updateState();
  }
  render() {
    let cameraBlock;
    this.openCamera();
    if (!this._cameraStatus) {
      // cameraBlock = <img src={this.url_logo} class={"logo"} style={this.logo_style ? JSON.parse(this.logo_style) : ""} alt="logo" />;
    }
    else {
      cameraBlock =
        h("camera-comp", { class: "block", showMask: this._showMask, device: this._device, faceDetection: this._face_detection, modelPath: this.model_path, probabilityThreshold: this._probabilityThreshold });
    }
    return (h("div", { class: "cameraContainer", id: "cameraContainer", style: { backgroundColor: this.background_color } }, h("div", { class: "wrapperCamera", style: { height: this._disable_control_panel ? "100%" : "65%" } }, cameraBlock), h("control-panel", { class: "block", mobile: this._mobile, disableControlPanel: this._disable_control_panel, cameraStatus: this._cameraStatus, resolutionOnPhoto: this._resolutionOnPhoto, mobileMakePhoto: this._mobileMakePhoto, faceDetection: this._face_detection })));
  }
  static get is() { return "camera-component"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() {
    return {
      "$": ["mainComponent.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["mainComponent.css"]
    };
  }
  static get properties() {
    return {
      "url_logo": {
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
        "attribute": "url_logo",
        "reflect": false
      },
      "show_mask": {
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
        "attribute": "show_mask",
        "reflect": false
      },
      "background_color": {
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
        "attribute": "background_color",
        "reflect": false
      },
      "disable_control_panel": {
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
        "attribute": "disable_control_panel",
        "reflect": false
      },
      "stop_after_capturing": {
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
        "attribute": "stop_after_capturing",
        "reflect": false
      },
      "face_detection": {
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
        "attribute": "face_detection",
        "reflect": false
      },
      "model_path": {
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
        "attribute": "model_path",
        "reflect": false
      },
      "probability_threshold": {
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
        "attribute": "probability_threshold",
        "reflect": false
      },
      "debug": {
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
        "attribute": "debug",
        "reflect": false
      },
      "logo_style": {
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
        "attribute": "logo_style",
        "reflect": false
      }
    };
  }
  static get states() {
    return {
      "_resolutionOnPhoto": {},
      "_cameraStatus": {},
      "_mobileMakePhoto": {},
      "_stopAfterCapturing": {},
      "_showMask": {},
      "_disable_control_panel": {},
      "_face_detection": {},
      "_probabilityThreshold": {},
      "_debug": {},
      "video": {},
      "canvas": {}
    };
  }
  static get elementRef() { return "component"; }
  static get listeners() {
    return [{
        "name": "videoStarted",
        "method": "videoStarted",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "retakePhoto",
        "method": "retakePhoto",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "takePhoto",
        "method": "takePhoto",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "openCamera",
        "method": "openCamera",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "loadModels",
        "method": "loadModels",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "errorCamera",
        "method": "errorCamera",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "closeCamera",
        "method": "closeCamera",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "makePhoto",
        "method": "makePhoto",
        "target": undefined,
        "capture": false,
        "passive": false
      }];
  }
}
