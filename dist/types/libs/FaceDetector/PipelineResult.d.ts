export declare class PipelineResultImpl implements PipelineResult {
  FACE_ANGLE_TOO_LARGE: boolean;
  FACE_CLOSE_TO_BORDER: boolean;
  FACE_NOT_FOUND: boolean;
  FACE_TOO_SMALL: boolean;
  PROBABILITY_TOO_SMALL: boolean;
  TOO_MANY_FACES: boolean;
}
export interface PipelineResult {
  FACE_NOT_FOUND: boolean;
  TOO_MANY_FACES: boolean;
  FACE_ANGLE_TOO_LARGE: boolean;
  PROBABILITY_TOO_SMALL: boolean;
  FACE_TOO_SMALL: boolean;
  FACE_CLOSE_TO_BORDER: boolean;
}
