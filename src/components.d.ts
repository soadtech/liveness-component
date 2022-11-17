/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Device } from "./IDevice";
export namespace Components {
    interface CameraComp {
        "device": Device;
        "faceDetection": boolean;
        "modelPath": string;
        "probabilityThreshold": number;
        "showMask": boolean;
    }
    interface CameraComponent {
        "background_color": string;
        "debug": string;
        "disable_control_panel": string;
        "face_detection": string;
        "logo_style": string;
        "model_path": string;
        "probability_threshold": string;
        "show_mask": string;
        "stop_after_capturing": string;
        "url_logo": string;
    }
    interface ControlPanel {
        "cameraStatus": number;
        "disableControlPanel": boolean;
        "faceDetection": boolean;
        "mobile": boolean;
        "mobileMakePhoto": boolean;
        "resolutionOnPhoto": boolean;
    }
}
export interface CameraCompCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLCameraCompElement;
}
export interface ControlPanelCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLControlPanelElement;
}
declare global {
    interface HTMLCameraCompElement extends Components.CameraComp, HTMLStencilElement {
    }
    var HTMLCameraCompElement: {
        prototype: HTMLCameraCompElement;
        new (): HTMLCameraCompElement;
    };
    interface HTMLCameraComponentElement extends Components.CameraComponent, HTMLStencilElement {
    }
    var HTMLCameraComponentElement: {
        prototype: HTMLCameraComponentElement;
        new (): HTMLCameraComponentElement;
    };
    interface HTMLControlPanelElement extends Components.ControlPanel, HTMLStencilElement {
    }
    var HTMLControlPanelElement: {
        prototype: HTMLControlPanelElement;
        new (): HTMLControlPanelElement;
    };
    interface HTMLElementTagNameMap {
        "camera-comp": HTMLCameraCompElement;
        "camera-component": HTMLCameraComponentElement;
        "control-panel": HTMLControlPanelElement;
    }
}
declare namespace LocalJSX {
    interface CameraComp {
        "device"?: Device;
        "faceDetection"?: boolean;
        "modelPath"?: string;
        "onCloseCamera"?: (event: CameraCompCustomEvent<any>) => void;
        "onErrorCamera"?: (event: CameraCompCustomEvent<any>) => void;
        "onMakePhoto"?: (event: CameraCompCustomEvent<any>) => void;
        "onTakePhoto"?: (event: CameraCompCustomEvent<any>) => void;
        "onVideoStarted"?: (event: CameraCompCustomEvent<any>) => void;
        "probabilityThreshold"?: number;
        "showMask"?: boolean;
    }
    interface CameraComponent {
        "background_color"?: string;
        "debug"?: string;
        "disable_control_panel"?: string;
        "face_detection"?: string;
        "logo_style"?: string;
        "model_path"?: string;
        "probability_threshold"?: string;
        "show_mask"?: string;
        "stop_after_capturing"?: string;
        "url_logo"?: string;
    }
    interface ControlPanel {
        "cameraStatus"?: number;
        "disableControlPanel"?: boolean;
        "faceDetection"?: boolean;
        "mobile"?: boolean;
        "mobileMakePhoto"?: boolean;
        "onCloseCamera"?: (event: ControlPanelCustomEvent<any>) => void;
        "onMakePhoto"?: (event: ControlPanelCustomEvent<any>) => void;
        "onOpenCamera"?: (event: ControlPanelCustomEvent<any>) => void;
        "onRetakePhoto"?: (event: ControlPanelCustomEvent<any>) => void;
        "onTakePhoto"?: (event: ControlPanelCustomEvent<any>) => void;
        "resolutionOnPhoto"?: boolean;
    }
    interface IntrinsicElements {
        "camera-comp": CameraComp;
        "camera-component": CameraComponent;
        "control-panel": ControlPanel;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "camera-comp": LocalJSX.CameraComp & JSXBase.HTMLAttributes<HTMLCameraCompElement>;
            "camera-component": LocalJSX.CameraComponent & JSXBase.HTMLAttributes<HTMLCameraComponentElement>;
            "control-panel": LocalJSX.ControlPanel & JSXBase.HTMLAttributes<HTMLControlPanelElement>;
        }
    }
}
