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
import { States } from "../statesEnum";
import { StatesManager } from "../statseManager";

export class LevelSelector {
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
        const title: TextBlock = new TextBlock();
        title.text = "Levels";
        title.color = "white";
        title.fontSize = 42;
        title.fontFamily = "monospace";
        title.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        title.top = "34px";

        guiMenu.addControl(title);

        // level sandBox
        const levelDemo = Button.CreateSimpleButton(
            "Demo",
            "Go To Level SandBox",
        );
        levelDemo.width = 0.2;
        levelDemo.height = "40px";
        levelDemo.color = "white";
        levelDemo.onPointerDownObservable.add(() => {
            this._stateManage.switchTo(States.GAME);
        });
        guiMenu.addControl(levelDemo);
        // level 1
        const level1 = Button.CreateSimpleButton(
            "Level 1",
            "Go To Level 1",
        );
        level1.width = 0.2;
        level1.height = "40px";
        level1.color = "white";
        level1.top = "54px";
        level1.onPointerDownObservable.add(() => {
            this._stateManage.switchTo(States.GAME1);
        });
        guiMenu.addControl(level1);
        // level 2
        const level2 = Button.CreateSimpleButton(
            "Level 2",
            "Go To Level 2",
        );
        level2.width = 0.2;
        level2.height = "40px";
        level2.color = "white";
        level2.top = "104px";
        level2.onPointerDownObservable.add(() => {
            this._stateManage.switchTo(States.GAME2);
        });
        guiMenu.addControl(level2);

        // back button
        const startBtn = Button.CreateSimpleButton("Back", "Back");
        startBtn.width = 0.2;
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-54px";
        // startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        startBtn.onPointerDownObservable.add(() => {
            this._stateManage.switchTo(States.MAINMENU);
            scene.detachControl(); //observables disabled
        });
        guiMenu.addControl(startBtn);

        // scene finished loading
        await scene.whenReadyAsync();

        return scene;
    }
}
