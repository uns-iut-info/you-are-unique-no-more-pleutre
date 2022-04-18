import { Mesh, PickingInfo, Ray, Scene, Vector3 } from "@babylonjs/core";

export class Gravity {
    private mesh: Mesh;
    private scene: Scene;
    _inJump: boolean = false;
    private _gravity: Vector3 = new Vector3();
    private _grounded: boolean = false;
    private static readonly JUMP_FORCE: number = 0.8;
    private static readonly GRAVITY: number = -2.8;
    private _lastGroundPos: Vector3 = Vector3.Zero(); // keep track of the last grounded position

    constructor(scene: Scene, mesh: Mesh) {
        this.scene = scene;
        this.mesh = mesh;
    }

    private _floorRaycast(
        offsetx: number,
        offsetz: number,
        raycastlen: number
    ): Vector3 {
        let raycastFloorPos = new Vector3(
            this.mesh.position.x + offsetx,
            this.mesh.position.y + 0.6,
            this.mesh.position.z + offsetz
        );
        let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

        let predicate = function (mesh: any) {
            return mesh.isPickable && mesh.isEnabled();
        };
        let pick = this.scene.pickWithRay(ray, predicate) as PickingInfo;

        if (pick.hit) {
            return pick.pickedPoint as Vector3;
        } else {
            return Vector3.Zero();
        }
    }

    private _isGrounded(): boolean {
        if (this._floorRaycast(0, 0, 0.6).equals(Vector3.Zero())) {
            return false;
        } else {
            return true;
        }
    }

    private _updateGroundDetection(deltaTime: number, moveDirection: Vector3): void {
        if (!this._isGrounded()) {
            this._gravity = this._gravity.addInPlace(
                Vector3.Up().scale(deltaTime * Gravity.GRAVITY)
            );
            this._grounded = false;
        }
        //limit the speed of gravity to the negative of the jump power
        if (this._gravity.y < -Gravity.JUMP_FORCE) {
            this._gravity.y = -Gravity.JUMP_FORCE;
        }
        this.mesh.moveWithCollisions(moveDirection.addInPlace(this._gravity));

        if (this._isGrounded()) {
            this._inJump = false;
            this._gravity.y = 0;
            this._grounded = true;
            this._lastGroundPos.copyFrom(this.mesh.position);
        }
    }

    public updateGravity(deltaTime: number, moveDirection: Vector3): void {
        this._updateGroundDetection(deltaTime, moveDirection);
    }

    public jump(): boolean {
        if (!this._inJump && this._isGrounded()) {
            this._inJump = true;
            this._gravity.y = Gravity.JUMP_FORCE;
            return true;
        }
        return false;

    }
}
