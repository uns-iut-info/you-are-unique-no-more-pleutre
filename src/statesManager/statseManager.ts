import { Engine, Scene } from "@babylonjs/core";
import { MainMenuState } from "./states/mainMenu";
import { States } from "./statesEnum";
import { LevelSelector } from "./states/levelSelector";
import { Game } from "./states/game";

export class StatesManager {
    private _engine: Engine;
    private _scene: Scene;

    constructor(engine: Engine) {
        this._engine = engine;
        this._scene = new Scene(engine);

        // enable inspector
        this._enableInspector();
    }

    private _enableInspector(): void {
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });
    }

    public async switchTo(state: States) {

        switch (state) {
            case States.MAINMENU:
                const mainMenu = new MainMenuState(this._engine, this);
                this._scene = await mainMenu.load();
                break;
            case States.LEVELSELECTOR:
                const levelSelector = new LevelSelector(this._engine, this);
                this._scene = await levelSelector.load();
                break;
            case States.GAME:
                const game = new Game(this._engine, this);
                this._scene = await game.load();
                break;
        }
    }

    public getScene() {
        return this._scene;
    }
}
