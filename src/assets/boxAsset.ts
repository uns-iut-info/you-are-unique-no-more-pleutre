import { Color4, Mesh, MeshBuilder, Scene, Vector3, StandardMaterial, Color3 } from "@babylonjs/core";
import { colorsEnum } from "../assets/colorsEnum";

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


        var mat = new StandardMaterial("mat", this._scene);
        mat.alpha = 0.7;
        mat.diffuseColor = Color3.FromHexString(colorsEnum.ORANGE)
        box.enableEdgesRendering();
        // TODO put on ENUM the color
        // box.edgesColor = Color4.FromInts(46, 204, 113, 127)
        box.edgesColor = Color4.FromColor3(Color3.FromHexString(colorsEnum.YELLOW))
        box.edgesWidth = 10;        
        box.edgesShareWithInstances = true;
        box.material = mat;

        box.checkCollisions = true;
        box.isPickable = true;
        box.setEnabled(true);

        box.ellipsoid = new Vector3(1, 1, 1);


        return {
            mesh: box as Mesh,
        };
    }
}