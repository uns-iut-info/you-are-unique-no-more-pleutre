import {
    Mesh, Quaternion, Scene, Vector3
} from "@babylonjs/core";
import { Colision } from "./colision";
import { Gravity } from "./gravity";
import { PlayerInput } from "./inputControler";
import { PlayerCamera } from "./playerCamera";

export class Player {

    private _scene: Scene;
    private _mesh: Mesh;

    // Const values
    private static readonly PLAYER_SPEED_MOVE: number = 40;
    private static readonly MAX_PLAYER_SPEED_MOVE: number = 35;
    private static readonly PLAYER_SPEED_ROTATION: number = 10;
    private static readonly JUMP_FORCE: number = 2000;
    private static readonly MAX_SPEED: number = 40;

    private _colision: Colision;
    private _gravity: Gravity;

    private _speedVector: Vector3;

    constructor(
        assets: any,
        scene: Scene,
    ) {
        this._scene = scene;
        this._mesh = assets.mesh;
        this._colision = new Colision(this._scene, this._mesh);
        this._gravity = new Gravity();
        this._speedVector = Vector3.Zero();
    }


    private _playerMovement(deltaTime: number, input: PlayerInput, camera: PlayerCamera): Vector3 {

        // get camera axis
        const fwd = camera.getCameraForward();
        const right = camera.getCameraRight();

        // calculate acceleration
        const yAcceleration = fwd.scaleInPlace(input.vertical);
        const xAcceleration = right.scaleInPlace(input.horizontal);

        let acceleration = xAcceleration.add(yAcceleration).normalize();
        acceleration = acceleration.normalize()

        // calculate speed vector
        let newSpeedVector = acceleration.scale(deltaTime);

        // Limit accumulation
        let x = newSpeedVector._x * Player.PLAYER_SPEED_MOVE;
        let z = newSpeedVector._z * Player.PLAYER_SPEED_MOVE;
        
        if (Math.abs(this._speedVector._x) > Math.abs(x) * Player.MAX_PLAYER_SPEED_MOVE) {
            x = 0
        }
        if (Math.abs(this._speedVector._z) > Math.abs(z) * Player.MAX_PLAYER_SPEED_MOVE) {
            z = 0
        }

        newSpeedVector = new Vector3(
            x,
            newSpeedVector._y,
            z
        );

        return newSpeedVector;
    }

    private _player_jump(deltaTime: number, input: PlayerInput): Vector3 {
        
        if (input.jump && this._colision.isGrounded()) {
            return Vector3.Up().scale(Player.JUMP_FORCE * deltaTime);
        } else {
            return Vector3.Zero();
        }
    }

    private _playerRotation(deltaTime: number, input: PlayerInput, camera: PlayerCamera): void {

        // if there's no input detected, prevent rotation and keep player in same rotation
        if (input.horizontal + input.vertical == 0) {
            return;
        }

        // rotation based on input & the camera angle
        let angle = Math.atan2(
            input.horizontal,
            input.vertical
        );
        angle += camera.getCameraRotationY();

        let targ = Quaternion.FromEulerAngles(0, angle, 0);
        this._mesh.rotationQuaternion = Quaternion.Slerp(
            this._mesh.rotationQuaternion as Quaternion,
            targ,
            Player.PLAYER_SPEED_ROTATION * deltaTime
        );
    }

    private _limitSpeed() {
        if (this._speedVector.length() > Player.MAX_SPEED) {
            this._speedVector = this._speedVector.normalize().scale(Player.MAX_SPEED)
        }

    }

    private _updatePlayerPosition(deltaTime: number, input: PlayerInput, camera: PlayerCamera) {

        // calculate speed vector
        this._speedVector.addInPlace(this._playerMovement(deltaTime, input, camera));
        this._speedVector.addInPlace(this._player_jump(deltaTime, input));
        this._speedVector.addInPlace(this._gravity.update(deltaTime));
        this._speedVector = this._colision.update(this._speedVector, deltaTime);

        // calculate position vector
        const move_vector = this._speedVector.scale(deltaTime);

        // update player position
        this._mesh.moveWithCollisions(move_vector);
    }
    
    public update(deltaTime: number, input: PlayerInput, camera: PlayerCamera): void {
        this._updatePlayerPosition(deltaTime, input, camera);
        this._playerRotation(deltaTime, input, camera);
        this._limitSpeed()
    }

    public getColision() : Colision {
        return this._colision;
    }
}
