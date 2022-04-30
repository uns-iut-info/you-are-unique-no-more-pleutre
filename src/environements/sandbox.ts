import { Color4, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";

export class SandBox {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {

        var ground = MeshBuilder.CreateBox(
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
        // var box = Mesh.CreateBox("ground", 3, this._scene);
    }
}
