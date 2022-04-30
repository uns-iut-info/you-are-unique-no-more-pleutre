import {
    Mesh, Quaternion, Scene, ShadowGenerator, TransformNode, UniversalCamera, Vector3
} from "@babylonjs/core";
import { Gravity } from "./gravity";
import { PlayerCamera } from "./playerCamera";

export class Player extends TransformNode {
    // public camera!: any;
    public scene: Scene;
    private _input;
    //Player
    public mesh: Mesh; //outer collisionbox of player

    //const values
    private static readonly PLAYER_SPEED: number = 30;

    //player movement vars
    private _deltaTime: number = 0;
    private _h!: number;
    private _v!: number;

    private _speedVector: Vector3 = new Vector3();
    private _inputAmt!: number;


    private _cameraObject: PlayerCamera;

    private _gravity: Gravity;

    constructor(
        assets: any,
        scene: Scene,
        shadowGenerator: ShadowGenerator,
        input?: any
    ) {
        super("player", scene);
        this.scene = scene;

        this.mesh = assets.mesh;
        this.mesh.parent = this;

        this._cameraObject = new PlayerCamera(this.scene, this.mesh);
        this._gravity = new Gravity(this.scene, this.mesh);

        shadowGenerator.addShadowCaster(assets.mesh); //the player mesh will cast shadows

        this._input = input;
    }

    private _updateFromControls(): void {

        // Camera rotation
        if (this._input.rotateCamera) {
            this._cameraObject.rotateCamera(Math.PI / 2)
        }

        // Move
        this._player_movement();

        // Jump
        if (this._input.jumpKeyDown) {
            this._gravity.jump()
        }

        // Rotations
        this._player_rotation();
    }

    private _player_movement(): void {
        //check if there is movement to determine if rotation is needed
        this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;

        let next_vector = Vector3.Zero(); // vector that holds movement information
        this._h = this._input.horizontal; //x-axis
        this._v = this._input.vertical; //z-axis

        // --MOVEMENTS BASED ON CAMERA (as it rotates)--
        let fwd = this._cameraObject.getCameraForward();
        let right = this._cameraObject.getCameraRight();

        let correctedVertical = fwd.scaleInPlace(this._v);
        let correctedHorizontal = right.scaleInPlace(this._h);

        // movement based off of camera's view
        let move = correctedHorizontal.addInPlace(correctedVertical);

        // normalize for next step
        next_vector = new Vector3(
            move.normalize().x,
            this._speedVector.y,
            move.normalize().z
        );

        //clamp the input value so that diagonal movement isn't twice as fast
        let inputMag = Math.abs(this._h) + Math.abs(this._v);
        if (inputMag < 0) {
            this._inputAmt = 0;
        } else if (inputMag > 1) {
            this._inputAmt = 1;
        } else {
            this._inputAmt = inputMag;
        }

        //final movement that takes into consideration the inputs
        this._speedVector = new Vector3(
            next_vector._x * this._inputAmt * Player.PLAYER_SPEED,
            next_vector._y,
            next_vector._z * this._inputAmt * Player.PLAYER_SPEED,
        );
    }

    private _player_rotation(): void {
        let input = new Vector3(
            this._input.horizontalAxis,
            0,
            this._input.verticalAxis
        ); //along which axis is the direction
        if (input.length() == 0) {
            //if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }
        //rotation based on input & the camera angle
        let angle = Math.atan2(
            this._input.horizontalAxis,
            this._input.verticalAxis
        );
        angle += this._cameraObject.getCameraRotationY();
        let targ = Quaternion.FromEulerAngles(0, angle, 0);
        this.mesh.rotationQuaternion = Quaternion.Slerp(
            this.mesh.rotationQuaternion as Quaternion,
            targ,
            10 * this._deltaTime
        );
    }

    private _beforeRenderUpdate(): void {
        const dt = 0.01;
        let accumulator = 0.0;

        const frameTime = this.scene.getEngine().getDeltaTime() / 1000.0;

        accumulator += frameTime;

        while (accumulator >= dt) {
            accumulator -= dt;
            this._updateFromControls();
            this._gravity.updateGravity(this._speedVector, dt);
        }

    }

    public activatePlayerCamera(): UniversalCamera {
        this.scene.registerBeforeRender(() => {
            this._beforeRenderUpdate();
            this._cameraObject._updateCamera();
        });
        return this._cameraObject.getUniverselCame();
    }
}
