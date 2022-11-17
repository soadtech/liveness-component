export interface IConstraintsDefault {
  audio: boolean;
  video: {
    facingMode: string;
    width: {
      min?: number;
      exact?: number;
      ideal?: number;
    };
    height: {
      min?: number;
      exact?: number;
      ideal?: number;
    };
  };
}
export interface IConstraintsMac {
  audio: boolean;
  video: {
    facingMode: string;
    width: number;
    height: number;
  };
}
