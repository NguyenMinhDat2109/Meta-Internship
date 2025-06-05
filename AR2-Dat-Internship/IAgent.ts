import * as hz from 'horizon/core';
export interface IAgent
{
  /**
   * Movement Speed
   */
  Speed: Readonly<number>;

  /**
   * Current Position
   */
  Position: hz.Vec3;

  /**
   * Current Rotation
   */
  Rotation: hz.Vec3;
}
