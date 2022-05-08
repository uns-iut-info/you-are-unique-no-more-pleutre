import { Color4, HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";

export class SandBox {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {

        // Background color
        this._scene.clearColor = new Color4(
            0.01568627450980392,
            0.01568627450980392,
            0.20392156862745098
        );

        // Objects
        const ground = MeshBuilder.CreateBox(
            "ground",
            {
                width: 24,
                depth: 24,
                height: 24,
                faceColors: [
                    new Color4(1, 0, 1, 1),
                    new Color4(1, 1, 1, 1),
                    new Color4(0, 0, 0, 1),
                    new Color4(1, 1, 0, 1),
                    new Color4(0, 1, 1, 1),
                    new Color4(0, 0, 1, 1),
                ],
            }, this._scene);
        ground.scaling = new Vector3(1, 0.02, 1);
        ground.checkCollisions = true;
        ground.isPickable = true;
        ground.setEnabled(true);



        const object = MeshBuilder.CreateBox(
            "ground",
            {
                width: 4,
                depth: 4,
                height: 4,
            }, this._scene);

        object.checkCollisions = true;
        object.isPickable = true;
        object.setEnabled(true);

        // lights
        const light = new HemisphericLight(
            "light1",
            new Vector3(0, 1, 0),
            this._scene
        );
        light.intensity = 0.7;
    }
}
