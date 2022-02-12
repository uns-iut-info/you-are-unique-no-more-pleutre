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
} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import { StatesManager } from "../statseManager";
import { States } from "../statesEnum";

export class Game {
    private _engine: Engine;
    private _stateManage: StatesManager;

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

        let camera = new ArcRotateCamera(
            "camera",
            -Math.PI / 2,
            Math.PI / 2.5,
            2,
            new Vector3(0, 0, 0),
            scene
        );

        const light = new HemisphericLight(
            "light1",
            new Vector3(0, 1, 0),
            scene
        );

        const ground = MeshBuilder.CreateBox("ground", {}, scene);
        ground.scaling = new Vector3(1, 0.1, 1);

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
