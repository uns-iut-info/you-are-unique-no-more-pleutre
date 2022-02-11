import {
    TransformNode,
    ShadowGenerator,
    Scene,
    Mesh,
    UniversalCamera,
    ArcRotateCamera,
    Vector3,
    Camera,
} from "@babylonjs/core";

export class Player extends TransformNode {
    public camera!: Camera;
    public scene: Scene;
    private _input;

    //Player
    public mesh: Mesh; //outer collisionbox of player

    constructor(
        assets: any,
        scene: Scene,
        shadowGenerator: ShadowGenerator,
        input? : InputEvent
    ) {
        super("player", scene);
        this.scene = scene;
        this._setupPlayerCamera();

        this.mesh = assets.mesh;
        this.mesh.parent = this;

        shadowGenerator.addShadowCaster(assets.mesh); //the player mesh will cast shadows

        this._input = input; //inputs we will get from inputController.ts
    }

    private _setupPlayerCamera() {

        const camera = new ArcRotateCamera(
            "arc",
            -Math.PI / 2,
            Math.PI / 2,
            40,
            new Vector3(0, 0, 0),
            this.scene
        );
    }
}
