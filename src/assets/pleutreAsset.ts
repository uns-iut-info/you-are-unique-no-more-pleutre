import { Color3, Color4, Matrix, Mesh, MeshBuilder, Quaternion, Scene, StandardMaterial, Texture, Vector3 } from "@babylonjs/core";
import { FurMaterial } from "@babylonjs/materials/fur/";

export class PleutreAsset {

    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public load() {

        //collision mesh
        const outer = Mesh.CreateSphere(
            "outer",
            200, 1,
            this._scene
        );

        // Fur Material
        var furMaterial = new FurMaterial("fur", this._scene);
        furMaterial.highLevelFur = false;
        furMaterial.furLength = 1;
        furMaterial.furAngle = 0;
        furMaterial.furColor = new Color3(
            Math.random(), 
            Math.random(), 
            Math.random()
        );
        furMaterial.furGravity = new Vector3(0, -1, 0);
            
        outer.material = furMaterial;
        
        // Furify the sphere to create the high level fur effect
        // The first argument is sphere itself. The second represents
        // the quality of the effect
        var quality = 30;
        var shells = FurMaterial.FurifyMesh(outer, quality);


        // outer.isVisible = false;
        outer.isPickable = false;
        outer.checkCollisions = true;

        outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
        
        // //move origin of box collider to the bottom of the mesh (to match player mesh)
        outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

        // //for collisions
        outer.ellipsoid = new Vector3(1, 1.5, 1);
        outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

        return {
            mesh: outer as Mesh,
        };
    }
}