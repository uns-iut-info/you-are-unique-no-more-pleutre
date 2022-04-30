import {
  int,
  Mesh,
  Scene,
  TransformNode,
  UniversalCamera,
  Vector3
} from "@babylonjs/core";

export class PlayerCamera {
  private _camRoot!: TransformNode;

  private _rotation!: Vector3;
  private _target_position!: Vector3;

  public camera!: any;

  private static readonly ORIGINAL_TILT: Vector3 = new Vector3(
    0,
    0,
    0
  );
  private static readonly ORIGINAL_DISTANCE: int = -30;
  private static readonly ORIGINAL_FOV: int = 0.47350045992678597;

  private scene: Scene;
  private mesh: Mesh;

  constructor(scene: Scene, mesh: Mesh) {
    this.scene = scene;
    this.mesh = mesh;
    this.scene.activeCamera = this._setupPlayerCamera();
  }

  private _setupPlayerCamera() {
    // Root camera parent
    // Handles positioning of the camera to follow the player
    this._camRoot = new TransformNode("root");
    this._camRoot.rotation = new Vector3(0, Math.PI / 2, 0);
    this._rotation = this._camRoot.rotation;
    this._target_position = this._camRoot.position;

    // Tilt camera
    // Manage tilt around the player
    let yTilt = new TransformNode("ytilt");
    yTilt.rotation = PlayerCamera.ORIGINAL_TILT;
    yTilt.parent = this._camRoot;

    // Main Camera
    // Our actual camera that's pointing at our root's position
    this.camera = new UniversalCamera(
      "cam",
      new Vector3(0, 0, PlayerCamera.ORIGINAL_DISTANCE),
      this.scene
    );
    this.camera.lockedTarget = this._target_position;
    this.camera.fov = PlayerCamera.ORIGINAL_FOV;
    this.camera.parent = yTilt;

    return this.camera;
  }

  public _updateCamera(): void {
    this._camRoot.rotation = Vector3.Lerp(
      this._camRoot.rotation,
      this._rotation,
      0.15
    );

    let centerPlayer = this.mesh.position.y + 3;
    this._camRoot.position = Vector3.Lerp(
      this._camRoot.position,
      new Vector3(this.mesh.position.x, centerPlayer, this.mesh.position.z),
      0.4
    );
  }

  public isRotating(): boolean {
    return Math.abs(this._camRoot.rotation._y - this._rotation._y) > 0.001;
  }

  public rotateCamera(angle : number): boolean {
    if (!this.isRotating()) {
      this._rotation = new Vector3(
        this._camRoot.rotation._x,
        this._camRoot.rotation._y + angle,
        this._camRoot.rotation._z
      );
      return true;
    }

    return false;
  }

  public getUniverselCame(): any {
    return this.camera;
  }

  public getCameraForward(): Vector3 {
    return this._camRoot.forward;
  }

  public getCameraRight(): Vector3 {
    return this._camRoot.right;
  }

  public getCameraRotationY(): number {
    return this._camRoot.rotation.y;
  }
}
