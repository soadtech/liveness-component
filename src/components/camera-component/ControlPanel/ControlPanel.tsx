import { Component, Prop, h, Event, EventEmitter } from '@stencil/core';
import Fragment from 'stencil-fragment'
import readyIcon from "../../../assets/ready.svg";

@Component({
  tag: 'control-panel',
  styleUrl: 'controlPanel.css'
})

export class ControlPanel {
  @Prop() mobile: boolean;
  @Prop() disableControlPanel: boolean;
  @Prop() cameraStatus: number;
  @Prop() resolutionOnPhoto: boolean;
  @Prop() mobileMakePhoto: boolean;
  @Prop() faceDetection: boolean;

  @Event({
    eventName: 'openCamera',
  }) eventOpenCamera: EventEmitter;

  @Event({
    eventName: 'closeCamera',
  }) eventCloseCamera: EventEmitter;

  @Event({
    eventName: 'makePhoto',
  }) eventMakePhoto: EventEmitter;

  @Event({
    eventName: 'retakePhoto',
  }) eventRetakePhoto: EventEmitter;
  @Event({
    eventName: 'takePhoto',
  }) eventTakePhoto: EventEmitter;


  makePhoto = () => {
    this.eventMakePhoto.emit();
  };

  closeCamera = () => {
    this.eventCloseCamera.emit();
  };

  openCamera = () => {
    this.eventOpenCamera.emit();
  };

  takePhoto = () => {
    this.eventTakePhoto.emit();
  };

  retakePhoto = async () => {
    this.eventRetakePhoto.emit();
  };

  render(): any {
    return (
      <div class={"controlPanel" + (this.mobile ? " controlMobile": "")}>
        {this.mobile ? (
          <div>
            {this.cameraStatus ? (
              <div>
                {this.mobileMakePhoto ? (
                  <div>
                    <div onClick={this.retakePhoto} class="retake">retake</div>
                    <img
                      onClick={this.takePhoto}
                      class="shoot takePhoto"
                      src={readyIcon}
                    />
                  </div>
                ) : (
                  <button onClick={this.makePhoto} disabled={!this.resolutionOnPhoto} class="shoot"/>
                  )}
                <div onClick={this.closeCamera} class="close" >close</div>
              </div>

            ) : (
              <div>{this.disableControlPanel ? (<div />) : (<button onClick={this.openCamera}>Turn on camera</button>)}</div>
            )}
          </div>
        ) : (
          <Fragment>
            {!this.disableControlPanel ? (
              <Fragment>
                {this.cameraStatus ? (
                  <Fragment>
                    <button onClick={this.makePhoto} disabled={!this.resolutionOnPhoto}>Capture</button>
                    <button onClick={this.closeCamera} class={"cameraOff"}>Close camera</button>
                  </Fragment>
                ) : (
                  <button onClick={this.openCamera}>Open camera</button>
                )}
              </Fragment>
            ): (<div/>)}
          </Fragment>
        )}
      </div>
    )
  }
}
