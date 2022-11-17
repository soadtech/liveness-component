import { Component, Prop, h, Listen, State, Element } from '@stencil/core';
import Events from "../../../helpers/Events";
import { Device } from "../../../IDevice";
import { getConstraints, initDevice } from "../../../helpers";
import { IConstraintsDefault, IConstraintsMac } from "../../../IStream";
import { Stream } from "../../../helpers/Stream";
import { Detector } from "../../../libs/FaceDetector/Detector";

// @ts-ignore
import logo from "./../../../assets/logo-min.png";


@Component({
  tag: 'camera-component',
  styleUrl: 'mainComponent.css',
  shadow: true
})
export class MyComponent {
  @Element() component: HTMLElement;

  @Prop() url_logo: string;
  @Prop() show_mask: string;
  @Prop() background_color: string;
  @Prop() disable_control_panel: string;
  @Prop() stop_after_capturing: string;
  @Prop() face_detection: string;
  @Prop() model_path: string;
  @Prop() probability_threshold: string;
  @Prop() debug: string;
  @Prop() logo_style: string;

  @State() private _resolutionOnPhoto: boolean;
  @State() private _cameraStatus: number;
  @State() private _mobileMakePhoto: boolean;
  @State() private _stopAfterCapturing: boolean;
  @State() private _showMask: boolean;
  @State() private _disable_control_panel: boolean;
  @State() private _face_detection: boolean;
  @State() private _probabilityThreshold: number;
  @State() private _debug: boolean;

  private _device: Device;
  private _mobile: boolean;

  @Listen('videoStarted')
  videoStarted() {
    this._resolutionOnPhoto = true;
  };

  @Listen('retakePhoto')
  async retakePhoto() {
    this._mobileMakePhoto = false;
    await Stream.getInstance().resumeStream();
  };

  @Listen('takePhoto')
  takePhoto() {
    Stream.getInstance()
      .takePhoto()
      .then(res => {
          this.photoIsReady(res);
        })
  };

  @Listen('openCamera')
  async openCamera() {
    this._cameraStatus = 1;
    const constraints: IConstraintsDefault | IConstraintsMac = getConstraints(this._device.isMac);
    setTimeout(() => { // taking out work with a media device from this method, you doom yourself to hellish torments with support for ios 14 (tested on iphone 7 and 12)
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          const superStream = Stream.getInstance();
          superStream.initStream(stream);
          this.videoStarted()
        })
        .catch((e) => {
          this.closeCamera();
          Events.errorEvent(e)
        });
    }, 100);
  };

  @Listen('loadModels')
  async loadModels(event: CustomEvent<any>) {
    await Detector.initDetector(event.detail.path)
  };

  @Listen('errorCamera')
  errorCamera(error) {
    Events.errorEvent(error.detail.message);
  };

  @Listen('closeCamera')
  closeCamera() {
    if (Stream.instance) {
      this._cameraStatus = 0;
      Events.closeEvent();
      Stream.getInstance().dropStream();
      this._mobileMakePhoto = false;
      this._resolutionOnPhoto = false;
    }
  };

  @Listen('makePhoto')
  makePhoto() {
    if (this._mobile) {
      this._mobileMakePhoto = true;
      Stream.getInstance().pauseStream();
    } else {
      this.takePhoto();
    }
  };

  updateState = () => {
    this._showMask = this.show_mask === "true";
    this._disable_control_panel = this.disable_control_panel === "true";
    this._face_detection = this.face_detection === "true";
    this._stopAfterCapturing = this.stop_after_capturing === "true";
    this._probabilityThreshold = this.probability_threshold ? +this.probability_threshold : 50;
    this.url_logo = this.url_logo? this.url_logo: "";
    this._debug = this.debug  === "true";
    Detector.debug = this._debug;
  };


  constructor() {
    this.updateState();
    this._cameraStatus = 0;
    this._resolutionOnPhoto = false;
    this._device = initDevice();
    this._mobile = this._device.isMobile;
    this._mobileMakePhoto = false;
  }

  componentWillLoad() {
    Events.init(this.component);
    if(!navigator.mediaDevices) {
      Events.errorEvent("This browser does not support webRTC");
    }
  }

  componentDidUpdate() {
    this.updateState();
  }

  photoIsReady = (photos) => {
    if (this._stopAfterCapturing)
      this.closeCamera();
    Events.captureEvent(photos);
  };

  enableButton = () => {
    this._resolutionOnPhoto = true;
  };

  @State() video: HTMLVideoElement;
  @State() canvas: HTMLCanvasElement;

  render() {
    let cameraBlock;

    if (!this._cameraStatus) {
      if (this.url_logo)
        cameraBlock = <img src={this.url_logo} class={"logo"} style={this.logo_style ? JSON.parse(this.logo_style) : ""} alt="logo" />;
      
    } else {
      cameraBlock =
        <camera-comp
          class={"block"}
          showMask={this._showMask}
          device={this._device}
          faceDetection={this._face_detection}
          modelPath={this.model_path}
          probabilityThreshold={this._probabilityThreshold}
        />
    }

    return (
      <div class="cameraContainer" id={"cameraContainer"} style={{backgroundColor: this.background_color}}>
        <div class="wrapperCamera" style={{height: this._disable_control_panel? "100%" : "65%"}}>
          {cameraBlock}
        </div>
        <control-panel
          class={"block"}
          mobile={this._mobile}
          disableControlPanel={this._disable_control_panel}
          cameraStatus={this._cameraStatus}
          resolutionOnPhoto={this._resolutionOnPhoto}
          mobileMakePhoto={this._mobileMakePhoto}
          faceDetection={this._face_detection}
        />
      </div>
    )

  }
}
