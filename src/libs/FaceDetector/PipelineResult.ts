export class PipelineResultImpl implements PipelineResult {
  FACE_ANGLE_TOO_LARGE = false;
  FACE_CLOSE_TO_BORDER = false;
  FACE_NOT_FOUND = false;
  FACE_TOO_SMALL = false;
  PROBABILITY_TOO_SMALL = false;
  TOO_MANY_FACES = false;
}

export interface PipelineResult {
  FACE_NOT_FOUND: boolean;
  TOO_MANY_FACES: boolean;
  FACE_ANGLE_TOO_LARGE: boolean;
  PROBABILITY_TOO_SMALL: boolean;
  FACE_TOO_SMALL: boolean;
  FACE_CLOSE_TO_BORDER: boolean;
}
