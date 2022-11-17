import { h } from '@stencil/core';
import Fragment from 'stencil-fragment';
import readyIcon from "../../../assets/ready.svg";
export class ControlPanel {
  constructor() {
    this.makePhoto = () => {
      this.eventMakePhoto.emit();
    };
    this.closeCamera = () => {
      this.eventCloseCamera.emit();
    };
    this.openCamera = () => {
      this.eventOpenCamera.emit();
    };
    this.takePhoto = () => {
      this.eventTakePhoto.emit();
    };
    this.retakePhoto = async () => {
      this.eventRetakePhoto.emit();
    };
    this.mobile = undefined;
    this.disableControlPanel = undefined;
    this.cameraStatus = undefined;
    this.resolutionOnPhoto = undefined;
    this.mobileMakePhoto = undefined;
    this.faceDetection = undefined;
  }
  render() {
    return (h("div", { class: "controlPanel" + (this.mobile ? " controlMobile" : "") }, this.mobile ? (h("div", null, this.cameraStatus ? (h("div", null, this.mobileMakePhoto ? (h("div", null, h("div", { onClick: this.retakePhoto, class: "retake" }, "retake"), h("img", { onClick: this.takePhoto, class: "shoot takePhoto", src: readyIcon }))) : (h("button", { onClick: this.makePhoto, disabled: !this.resolutionOnPhoto, class: "shoot" })), h("div", { onClick: this.closeCamera, class: "close" }, "close"))) : (h("div", null, this.disableControlPanel ? (h("div", null)) : (h("button", { onClick: this.openCamera }, "Turn on camera")))))) : (h(Fragment, null, !this.disableControlPanel ? (h(Fragment, null, this.cameraStatus ? (h(Fragment, null, h("button", { onClick: this.makePhoto, disabled: !this.resolutionOnPhoto }, "Capture"), h("button", { onClick: this.closeCamera, class: "cameraOff" }, "Close camera"))) : (h("button", { onClick: this.openCamera }, "Open camera")))) : (h("div", null))))));
  }
  static get is() { return "control-panel"; }
  static get originalStyleUrls() {
    return {
      "$": ["controlPanel.css"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["controlPanel.css"]
    };
  }
  static get properties() {
    return {
      "mobile": {
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
        "attribute": "mobile",
        "reflect": false
      },
      "disableControlPanel": {
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
        "attribute": "disable-control-panel",
        "reflect": false
      },
      "cameraStatus": {
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
        "attribute": "camera-status",
        "reflect": false
      },
      "resolutionOnPhoto": {
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
        "attribute": "resolution-on-photo",
        "reflect": false
      },
      "mobileMakePhoto": {
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
        "attribute": "mobile-make-photo",
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
        "method": "eventOpenCamera",
        "name": "openCamera",
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
        "method": "eventRetakePhoto",
        "name": "retakePhoto",
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
