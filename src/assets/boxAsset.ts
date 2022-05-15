import { Color4, Mesh, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";

export class boxAsset {

    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public load(id: Number) {

        var box = MeshBuilder.CreateBox(
            "box" + id,
            {
                width: 2,
                depth: 2,
                height: 2,
                faceColors: [
                    new Color4(1, 1, 0, 1),
                    new Color4(0, 1, 1, 1),
                    new Color4(1, 1, 1, 1),
                    new Color4(1, 0, 1, 1),
                    new Color4(0, 0, 1, 1),
                    new Color4(0, 0, 0, 1),
                ],
            },
            this._scene
        );
        box.checkCollisions = true;
        box.isPickable = true;
        box.setEnabled(true);

        box.ellipsoid = new Vector3(1, 1, 1);


        return {
            mesh: box as Mesh,
        };
    }
}