import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene } from "@babylonjs/core";
import { StatesManager } from "./statesManager/statseManager";
import { States } from "./statesManager/statesEnum";

class App {
    private _engine: Engine;
    private _stateManager;

    constructor() {
        this._configureStyleHtmlPage();
        const canvas: HTMLCanvasElement = this._createCanvas();

        // initialize babylon scene and engine
        this._engine = new Engine(canvas, true);
        this._stateManager = new StatesManager(this._engine);

        // run the main render loop
        this._main();
    }

    private _configureStyleHtmlPage(): void {
        document.documentElement.style["overflow"] = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
    }

    private _createCanvas(): HTMLCanvasElement {
        // create the canvas html element and attach it to the webpage
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        return canvas;
    }

    private async _main(): Promise<void> {
        // switch to the first state
        await this._stateManager.switchTo(States.GAME);

        // register a render loop to repeatedly render the scene
        this._engine.runRenderLoop(() => {
            const scene = this._stateManager.getScene();
            scene.render();
        });

        // resize if the screen is resized/rotated
        window.addEventListener("resize", () => {
            this._engine.resize();
        });
    }
}
new App();
