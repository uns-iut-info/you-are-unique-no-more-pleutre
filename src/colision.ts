import { Mesh, PickingInfo, Ray, RayHelper, Scene, Vector3 } from "@babylonjs/core";

export class Colision {
    private mesh: Mesh;
    private _scene: Scene;
    private _grounded: boolean = false;
    private static readonly FRICTION_FORCE: number = 0.2;
    private static readonly SLOW_LIMIT: number = 0.02;

    constructor(scene: Scene, mesh: Mesh) {
        this._scene = scene;
        this.mesh = mesh;
    }

    private _testIsGrounded(
        offsetx: number,
        offsety: number,
        offsetz: number,
        raycastlen: number
    ): Vector3 | null {

        // Send raycast to the floor to detect if there are any hits with meshes below the character
        let raycastStartPos = new Vector3(
            this.mesh.position.x + offsetx,
            this.mesh.position.y + offsety,
            this.mesh.position.z + offsetz
        );

        let ray = new Ray(raycastStartPos, Vector3.Down(), Math.abs(raycastlen));

        // Defined which type of meshes should be pickable
        let predicate = function (mesh: any) {
            return mesh.isPickable && mesh.isEnabled();
        };
        let pick = this._scene.pickWithRay(ray, predicate) as PickingInfo;

        if (pick.hit) {
            //grounded
            return pick.pickedPoint as Vector3
        } else {
            //not grounded
            return null;
        }
    }

    private _updateColision(speedVector: Vector3, deltaTime: number): Vector3 {
        let newSpeedVector = speedVector;

        // test if the player touches the ground
        const pickedPoint = this._testIsGrounded(0, 0, 0.5, 0.5);

        if (pickedPoint !== null) {
            this._grounded = true;

            // calculates the distance between the player and the ground
            const distance = this.mesh.position.y - pickedPoint.y;

            // If player is in the ground
            if (distance <= 0.02) {

                const down = newSpeedVector._y;
                if (newSpeedVector._y < 0) {
                    newSpeedVector._y = 0;
                }

                let position = newSpeedVector.scale(deltaTime);
                position.y = -distance;
                // this.mesh.moveWithCollisions(position);
            } else {
                this._grounded = false;
            }
        } else {
            this._grounded = false;
        }

        return newSpeedVector;
    }

    private _updateFriction(speedVector: Vector3, deltaTime: number): Vector3 {
        // friction
        let direction = new Vector3(
            speedVector._x,
            0,
            speedVector._z
        )
        direction.normalize();
        speedVector = speedVector.add(direction.scale(-Colision.FRICTION_FORCE));

        // stop if too slow
        if (Math.abs(speedVector._x) < Colision.SLOW_LIMIT) {
            speedVector._x = 0;
        }
        if (Math.abs(speedVector._z) < Colision.SLOW_LIMIT) {
            speedVector._z = 0;
        }

        return speedVector;
    }

    public update(speedVector: Vector3, deltaTime: number): Vector3 {
        speedVector = this._updateColision(speedVector, deltaTime);
        speedVector = this._updateFriction(speedVector, deltaTime);


        return speedVector;

    }

    public isGrounded(): boolean {
        return this._grounded;
    }
}
