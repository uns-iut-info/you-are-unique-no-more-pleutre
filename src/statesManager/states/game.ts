import { Engine, Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import { PleutreAsset } from "../../assets/pleutreAsset";
import { PlayerCamera } from "../../camera/playerCamera";
import { SandBox } from "../../environements/sandbox";
import { PlayerInput } from "../../inputControler";
import { Player } from "../../entity/player";
import { States } from "../statesEnum";
import { StatesManager } from "../statseManager";
import { Box } from "../../entity/box";

export let MESH_OBJECT: { [id: string]: any };

export class Game {
    private _engine: Engine;
    private _stateManage: StatesManager;
    private _scene: Scene;

    private _player!: Player;
    private _camera!: PlayerCamera;
    private _input!: PlayerInput

    private _boxes: Box[];


    constructor(engine: Engine, stateManager: StatesManager) {
        this._engine = engine;
        this._stateManage = stateManager;
        this._scene = new Scene(this._engine);
        this._boxes = [];
    }

    public async load() {

        // Environement
        const environment = new SandBox(this._scene);
        await environment.load();
        this._boxes = environment.getBoxes();
        MESH_OBJECT = environment.getMeshObject();


        // Input
        this._input = new PlayerInput(this._scene);

        // Player
        this._player = new Player(this._scene);
        this._player.getMesh().position._y = 5;
        MESH_OBJECT[this._player.getMesh().id] = this._player;

        // Camera
        this._camera = new PlayerCamera(this._scene, this._player.getMesh());

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
        await this._scene.whenReadyAsync();

        // Active loop game
        this._loop()

        return this._scene;
    }

    private _loop(): void {
        this._scene.registerBeforeRender(() => {

            const dt = 0.01;
            let accumulator = 0.0;

            const frameTime = this._scene.getEngine().getDeltaTime() / 1000.0;

            accumulator += frameTime;
            while (accumulator >= dt) {
                accumulator -= dt;
                this._player.update(dt, this._input, this._camera)
                this._camera.update(this._input);

                for (const box of this._boxes) {
                    box.update(dt, this._camera);
                }

            }

        });

    }

}
