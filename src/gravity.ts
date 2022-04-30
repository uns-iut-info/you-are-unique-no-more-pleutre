import { Mesh, PickingInfo, Ray, Scene, Vector3 } from "@babylonjs/core";

export class Gravity {
    private mesh: Mesh;
    private scene: Scene;
    _inJump: boolean = false;
    _needsJump: boolean = false;
    private _gravity: Vector3 = new Vector3();
    private _grounded: boolean = false;
    private static readonly JUMP_FORCE: number = 3000;
    private static readonly GRAVITY_FORCE: number = -200;

    constructor(scene: Scene, mesh: Mesh) {
        this.scene = scene;
        this.mesh = mesh;
    }

    private _floorRaycast(
        offsetx: number,
        offsetz: number,
        raycastlen: number
    ): Vector3 | null {

        // Send raycast to the floor to detect if there are any hits with meshes below the character
        let raycastFloorPos = new Vector3(
            this.mesh.position.x + offsetx,
            this.mesh.position.y + 0.5,
            this.mesh.position.z + offsetz
        );
        let ray;
        raycastlen -= 0.5;
        if (raycastlen < 0) {
            ray = new Ray(raycastFloorPos, Vector3.Down(), Math.abs(raycastlen));
        } else {
            ray = new Ray(raycastFloorPos, Vector3.Up(), Math.abs(raycastlen));
        }

        // Defined which type of meshes should be pickable
        let predicate = function (mesh: any) {
            return mesh.isPickable && mesh.isEnabled();
        };

        let pick = this.scene.pickWithRay(ray, predicate) as PickingInfo;

        if (pick.hit) {
            //grounded
            return pick.pickedPoint as Vector3;
        } else {
            //not grounded
            return null; // Vector3.Zero();
        }
    }

    // private _isGrounded(): boolean {
    //     if () {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    private _updateGroundDetection(speedVector: Vector3, deltaTime: number): void {
        let speed = 0;

        if (this._needsJump) {
            this._needsJump = false;
            this._inJump = true;
            this._grounded = false;
            speed = deltaTime * Gravity.JUMP_FORCE;
        } else {
            speed = deltaTime * Gravity.GRAVITY_FORCE;
        }


        // speedVector.addInPlace(Vector3.Up().scale(speed));
        speedVector.addInPlace(Vector3.Up().scale(speed));

        if (speedVector._y < -100) {
            speedVector._y = -100;
        }
        
        
        let move_vector = speedVector.scale(deltaTime);
        const pickedPoint = this._floorRaycast(0, 0, move_vector.y);
        
        if (pickedPoint !== null) {
            // there is an object on the way
            const distance = this.mesh.position.y - pickedPoint.y;
            move_vector.y = -distance;
            speedVector._y = 0;
            
            if (move_vector.y < 0) {
                // we hit the ground
                this._inJump = false;
                this._grounded = true;
            }
        }
        
        this.mesh.moveWithCollisions(move_vector);
    }

    public updateGravity(moveDirection: Vector3, deltaTime: number): void {
        this._updateGroundDetection(moveDirection, deltaTime);
    }

    public jump(): boolean {
        if (!this._inJump) {
            this._needsJump = true;
            return true;
        }
        return false;
    }
}
