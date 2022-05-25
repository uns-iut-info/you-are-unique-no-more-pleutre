import {
    Mesh, Scene, Vector3, VertexBuffer, StandardMaterial, Color3, Color4
} from "@babylonjs/core";
import { boxAsset } from "../assets/boxAsset";
import { PlayerCamera } from "../camera/playerCamera";
import { Gravity } from "../engine/gravity";

export class Box{

    private _mesh: Mesh;

    // Const values
    private static readonly MAX_SPEED: number = 40;

    private _gravity: Gravity;
    private _speedVector: Vector3;

    private _external_forces: Vector3;

    constructor(
        id: number,
        scene: Scene,
    ) {
        this._mesh = new boxAsset(scene).load(id).mesh;
        this._gravity = new Gravity();
        this._speedVector = Vector3.Zero();
        this._external_forces = Vector3.Zero();
    }

    private _limitSpeed() {
        if (this._speedVector.length() > Box.MAX_SPEED) {
            this._speedVector = this._speedVector.normalize().scale(Box.MAX_SPEED)
        }
    }

    private _updateBoxPosition(deltaTime: number, camera: PlayerCamera) {

        // calculate speed vector
        this._speedVector.addInPlace(this._gravity.update(deltaTime));

        // calculate position vector
        const move_vector = this._speedVector.scale(deltaTime);

        // update player position
        this._mesh.moveWithCollisions(move_vector);
    }

    private _updateExternalForces(deltaTime: number): void {
        this._speedVector.addInPlace(this._external_forces.scale(deltaTime))
        this._external_forces = Vector3.Zero();

    }

    public addExternalForce(externalForce : Vector3) {
        this._external_forces = this._external_forces.addInPlace(externalForce);
    }

    public update(deltaTime: number, camera: PlayerCamera): void {
        this._updateExternalForces(deltaTime);
        this._limitSpeed();
        this._updateBoxPosition(deltaTime, camera);
    }

    public getMesh(): Mesh {
        return this._mesh;
    }
}
