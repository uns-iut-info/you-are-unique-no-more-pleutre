import { Color3, Color4, HemisphericLight, MeshBuilder, Scene, Vector3 } from "@babylonjs/core";
import { Box } from "../entity/box";
import { colorsEnum } from "../assets/colorsEnum";

export class SandBox {
    private _level: String;
    private _scene: Scene;
    private _boxes: Box[];
    private _meshObject: { [id: string]: any };

    private _boxId = 0;

    constructor(scene: Scene, level: String) {
        this._level = level;
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

        this.loadObjects(this._level, this._scene)

        // Lights
        const light = new HemisphericLight(
            "light1",
            new Vector3(0, 1, 0),
            this._scene
        );
        light.intensity = 0.7;
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

    private loadObjects(level, scene){
        // Ground
        const ground = MeshBuilder.CreateBox(
            "ground",
            {
                width: 100,
                depth: 100,
                height: 24,
                faceColors: [
                    Color4.FromColor3(Color3.FromHexString(colorsEnum.DARK_BLUE)),
                    Color4.FromColor3(Color3.FromHexString(colorsEnum.DARK_BLUE)),
                    Color4.FromColor3(Color3.FromHexString(colorsEnum.DARK_BLUE)),
                    Color4.FromColor3(Color3.FromHexString(colorsEnum.DARK_BLUE)),
                    Color4.FromColor3(Color3.FromHexString(colorsEnum.DARK_BLUE)),
                    Color4.FromColor3(Color3.FromHexString(colorsEnum.DARK_BLUE)),
                    // new Color4(1, 0, 1, 1),
                    // new Color4(1, 1, 1, 1),
                    // new Color4(0, 0, 0, 1),
                    // new Color4(1, 1, 0, 1),
                    // new Color4(0, 1, 1, 1),
                    // new Color4(0, 0, 1, 1),
                ],
            }, scene);
        ground.enableEdgesRendering();
        ground.edgesColor = Color4.FromColor3(Color3.FromHexString(colorsEnum.LIGHT_BLUE))
        ground.edgesWidth = 10;        
        ground.edgesShareWithInstances = true;
        ground.scaling = new Vector3(1, 0.02, 1);
        ground.checkCollisions = true;
        ground.isPickable = true;
        ground.setEnabled(true);
        if(level == "demo"){

            // Bloc
            const object = MeshBuilder.CreateBox(
                "bloc",
                {
                    width: 4,
                    depth: 10,
                    height: 4,
                }, scene);

            object.checkCollisions = true;
            object.isPickable = true;
            object.setEnabled(true);

            // Box
            const box0 = this._createBox();
            box0.getMesh().position = new Vector3(-5, 3, 3);

            const box1 = this._createBox();
            box1.getMesh().position = new Vector3(5, 3, -3);
        }
        else {
            console.log(level)

            // Box
            const box0 = this._createBox();
            box0.getMesh().position = new Vector3(-15, 3, 3);

            const box1 = this._createBox();
            box1.getMesh().position = new Vector3(5, 1, 9);

            const box2 = this._createBox();
            box2.getMesh().position = new Vector3(25, 41, 2);
        }
    }
}
