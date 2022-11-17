export declare class HeadPosition {
  private readonly selectedOpenCvMethod;
  private readonly noseTip;
  private readonly bottomNose;
  private readonly lefteyeleftcorner;
  private readonly lefteyerightcorner;
  private readonly righteyerightcorner;
  private readonly righteyeleftcorner;
  private readonly leftmouth;
  private readonly rightmouth;
  private readonly leftnostril;
  private readonly rightnostril;
  private readonly focal_length;
  private readonly center;
  private drawingData;
  constructor(positions: any, dims: any);
  estimateHeadPose(): any;
  draw(ctx: any): void;
}
