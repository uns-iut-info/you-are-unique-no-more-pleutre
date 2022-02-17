import {
    Scene,
    Vector3,
    Engine,
    Color4,
    FreeCamera,
    HemisphericLight,
    MeshBuilder,
    ArcRotateCamera,
    Mesh,
    Matrix,
    StandardMaterial,
    Color3,
    Quaternion,
    PointLight,
    ShadowGenerator,
} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import { StatesManager } from "../statseManager";
import { States } from "../statesEnum";
import { SandBox } from "../../environements/sandbox";
import { Player } from "../../player";
import { PlayerInput } from "../../inputControler";

export class Game {
    private _engine: Engine;
    private _stateManage: StatesManager;
    public assets: any;

    constructor(engine: Engine, stateManager: StatesManager) {
        this._engine = engine;
        this._stateManage = stateManager;
    }

    public async load() {
        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(
            0.01568627450980392,
            0.01568627450980392,
            0.20392156862745098
        );

        const light = new HemisphericLight(
            "light1",
            new Vector3(0, 1, 0),
            scene
        );
        light.intensity = 0.5;

        const environment = new SandBox(scene);
        await environment.load(); //environment

        await this._loadCharacterAssets(scene);
        // new Player(scene);

        const light2 = new PointLight(
            "sparklight",
            new Vector3(0, 0, 0),
            scene
        );
        light2.diffuse = new Color3(
            0.08627450980392157,
            0.10980392156862745,
            0.15294117647058825
        );
        light2.intensity = 35;
        light2.radius = 1;

        const shadowGenerator = new ShadowGenerator(1024, light2);
        shadowGenerator.darkness = 0.4;

        const player = new Player(
            this.assets,
            scene,
            shadowGenerator,
            new PlayerInput(scene)
        );
        const camera = player.activatePlayerCamera();

        // create UI
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // play button
        const startBtn = Button.CreateSimpleButton("quit", "Quit");
        startBtn.width = 0.2;
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-34px";
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        startBtn.onPointerDownObservable.add(() => {
            this._stateManage.switchTo(States.LEVELSELECTOR);
        });
        guiMenu.addControl(startBtn);

        // scene finished loading
        await scene.whenReadyAsync();

        return scene;
    }

    private async _loadCharacterAssets(scene: Scene) {
        async function loadCharacter() {
            //collision mesh
            const outer = MeshBuilder.CreateBox(
                "outer",
                { width: 2, depth: 1, height: 3 },
                scene
            );
            // outer.isVisible = false;
            outer.isPickable = false;
            // outer.checkCollisions = true;

            //move origin of box collider to the bottom of the mesh (to match player mesh)
            outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

            //for collisions
            outer.ellipsoid = new Vector3(1, 1.5, 1);
            outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

            outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player

            var box = MeshBuilder.CreateBox(
                "Small1",
                {
                    width: 0.5,
                    depth: 0.5,
                    height: 0.25,
                    faceColors: [
                        new Color4(1, 0, 1, 1),
                        new Color4(1, 1, 1, 1),
                        new Color4(0, 0, 0, 1),
                        new Color4(1, 1, 0, 1),
                        new Color4(0, 1, 1, 1),
                        new Color4(0, 0, 1, 1),
                    ],
                },
                scene
            );
            box.position.y = 1.5;
            box.position.z = 1;

            var body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0, scene);
            var bodymtl = new StandardMaterial("red", scene);
            bodymtl.diffuseColor = new Color3(0.8, 0.5, 0.5);
            body.material = bodymtl;
            body.isPickable = false;
            body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin

            //parent the meshes
            box.parent = body;
            body.parent = outer;

            return {
                mesh: outer as Mesh,
            };
        }
        return loadCharacter().then((assets) => {
            this.assets = assets;
        });
    }
}
