import { Color4, HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { Box } from "../entity/box";



export class SandBox {
    private _scene: Scene;
    private _boxes: Box[];
    private _meshObject: { [id: string]: any };

    private _boxId = 0;

    constructor(scene: Scene) {
        this._scene = scene;
        this._boxes = [];
        this._meshObject = {};
    }

    public async load() {

        // Background color
        this._scene.clearColor = new Color4(
            0.01568627450980392,
            0.01568627450980392,
            0.20392156862745098
        );

        // Ground
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

        // Bloc
        const object = MeshBuilder.CreateBox(
            "bloc",
            {
                width: 4,
                depth: 4,
                height: 4,
            }, this._scene);

        object.checkCollisions = true;
        object.isPickable = true;
        object.setEnabled(true);

        // Lights
        const light = new HemisphericLight(
            "light1",
            new Vector3(0, 1, 0),
            this._scene
        );
        light.intensity = 0.7;

        // Box
        const box0 = this._createBox();
        box0.getMesh().position = new Vector3(-5, 3, 3);

        const box1 = this._createBox();
        box1.getMesh().position = new Vector3(5, 3, -3);
    }

    private _createBox(): Box {
        const box = new Box(this._boxId, this._scene);
        this._boxId++;
        this._boxes.push(box);
        this._meshObject[box.getMesh().id] = box;
        return box;
    }

    public getBoxes(): Box[] {
        return this._boxes;
    }

    public getMeshObject(): { [id: string]: any } {
        return this._meshObject;
    }
}
