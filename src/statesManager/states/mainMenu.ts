import {
    Scene,
    Mesh,
    Vector3,
    Engine,
    Color4,
    FreeCamera,
} from "@babylonjs/core";
import {
    AdvancedDynamicTexture,
    Button,
    Control,
    TextBlock,
} from "@babylonjs/gui";
import { StatesManager } from "../statseManager";
import { States } from "../statesEnum";

export class MainMenuState {
    private _engine: Engine;
    private _stateManage: StatesManager;

    constructor(engine: Engine, stateManager: StatesManager) {
        this._engine = engine;
        this._stateManage = stateManager;
    }

    public async load() {
        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0, 0, 0, 1);

        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        // create UI
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // title
        const mainTitle: TextBlock = new TextBlock();
        mainTitle.text = "No More Pleutre !";
        mainTitle.color = "white";
        mainTitle.fontSize = 42;
        mainTitle.fontFamily = "monospace";
        guiMenu.addControl(mainTitle);

        // play button
        const startBtn = Button.CreateSimpleButton("start", "Play");
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
