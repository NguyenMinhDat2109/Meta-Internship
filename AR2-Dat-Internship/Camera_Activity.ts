import LocalCamera from 'horizon/camera';
import * as hz from 'horizon/core';
const FIXED_CAMERA_PROPS = {
  MAX_CAMERA_X_OFFSET: 5,
  MAX_CAMERA_Z_OFFSET: 1,
  FIXED_CAMERA_POS: new hz.Vec3(-5, 17.5, -1.55),
  FIXED_CAMERA_ROT: hz.Quaternion.fromEuler(new hz.Vec3(60, 0, 0)),
  FIXED_CAMERA_HEIGHT: 17.5,
  FIXED_CAMERA_Z: -10,
};

export class Camera_Activity
{
  private cameraXPos = 0;
  private cameraZPos = 0;
  private currentPlayer: hz.Player;
  private footPosition = hz.Vec3.zero;

  constructor(player: hz.Player)
  {
    this.currentPlayer = player;
  }

  Process(deltaTime: number)
  {
    this.UpdateCameraPosition();
  }

  /**
 * Update camera position based on player's foot position
 */
  private UpdateCameraPosition()
  {
    let footPosition = this.currentPlayer.foot.position.get();
    if(this.footPosition == footPosition)
    {
      return;
    }
    this.footPosition = footPosition;
    this.cameraXPos = hz.clamp(this.footPosition.x, -FIXED_CAMERA_PROPS.MAX_CAMERA_X_OFFSET, FIXED_CAMERA_PROPS.MAX_CAMERA_X_OFFSET);
    this.cameraZPos = hz.clamp(this.footPosition.z, -FIXED_CAMERA_PROPS.MAX_CAMERA_Z_OFFSET, FIXED_CAMERA_PROPS.MAX_CAMERA_Z_OFFSET);
    LocalCamera.setCameraModeFixed({
      position: new hz.Vec3(this.cameraXPos, FIXED_CAMERA_PROPS.FIXED_CAMERA_HEIGHT, this.cameraZPos + FIXED_CAMERA_PROPS.FIXED_CAMERA_Z),
      rotation: FIXED_CAMERA_PROPS.FIXED_CAMERA_ROT,
    });
  }
}
