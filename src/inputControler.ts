import {
    ActionManager,
    ExecuteCodeAction,
    Scalar, Scene
} from "@babylonjs/core";

export class PlayerInput {
    public inputMap: any;

    // simple movement
    public horizontal: number = 0;
    public vertical: number = 0;

    public rotateRightCamera: boolean = false;
    public jump: boolean = false;

    constructor(scene: Scene) {
        scene.actionManager = new ActionManager(scene);

        this.inputMap = {};
        scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
                this.inputMap[evt.sourceEvent.key] =
                    evt.sourceEvent.type == "keydown";
            })
        );
        scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
                this.inputMap[evt.sourceEvent.key] =
                    evt.sourceEvent.type == "keydown";
            })
        );

        scene.onBeforeRenderObservable.add(() => {
            this.update();
        });
    }

    public update(): void {

        // vertical movement
        if (this.inputMap["ArrowUp"]) {
            this.vertical = 1;
        } else if (this.inputMap["ArrowDown"]) {
            this.vertical = -1;
        } else {
            this.vertical = 0;
        }

        // horizontal movement
        if (this.inputMap["ArrowLeft"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
        } else if (this.inputMap["ArrowRight"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
        } else {
            this.horizontal = 0;
        }

        // camera rotation
        if (this.inputMap["Control"]) {
            this.rotateRightCamera = true;
        } else {
            this.rotateRightCamera = false;
        }

        // jump
        if (this.inputMap[" "]) {
            this.jump = true;
        } else {
            this.jump = false;
        }
    }
}
