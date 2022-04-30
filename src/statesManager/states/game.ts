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
import { PlayerCharacter } from "../../assets/characters/player_asset";

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

        // await this._loadCharacterAssets(scene);
        const pc = new PlayerCharacter(scene);
        this.assets = pc._loadCharacterAssets(scene);
        this.assets.mesh.position._y = 1;

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
    
}
