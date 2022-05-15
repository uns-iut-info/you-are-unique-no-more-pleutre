import { Mesh, PickingInfo, Ray, Scene, Vector3 } from "@babylonjs/core";

export class Gravity {
    private static readonly GRAVITY_FORCE: number = 200;

    constructor() {
    }

    public update(deltaTime: number): Vector3 {
        return Vector3.Down().scale(deltaTime * Gravity.GRAVITY_FORCE);
    }
}
