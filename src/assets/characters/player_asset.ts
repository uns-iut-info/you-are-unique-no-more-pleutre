import { Color3, Color4, Matrix, Mesh, MeshBuilder, Quaternion, Scene, StandardMaterial, Vector3 } from "@babylonjs/core";

export class PlayerCharacter {

    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public _loadCharacterAssets(scene: Scene) {

        //collision mesh
        const outer = MeshBuilder.CreateBox(
            "outer",
            { width: 2, depth: 1, height: 3 },
            scene
        );
        // outer.isVisible = false;
        outer.isPickable = false;
        outer.checkCollisions = true;

        outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
        
        //move origin of box collider to the bottom of the mesh (to match player mesh)
        outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

        //for collisions
        outer.ellipsoid = new Vector3(1, 1.5, 1);
        outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

        outer.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player

        var box = MeshBuilder.CreateBox(
            "Small1",
            {

                width: 0.5,
                depth: 0.5,
                height: 0.25,
                faceColors: [
                    new Color4(1, 0, 1, 1),
                    new Color4(1, 1, 1, 1),
                    new Color4(0, 0, 0, 1),
                    new Color4(1, 1, 0, 1),
                    new Color4(0, 1, 1, 1),
                    new Color4(0, 0, 1, 1),
                ],
            },
            scene
        );
        box.position.y = 1.5;
        box.position.z = 1;

        var body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0, scene);
        var bodymtl = new StandardMaterial("red", scene);
        bodymtl.diffuseColor = new Color3(0.8, 0.5, 0.5);
        body.material = bodymtl;
        body.isPickable = false;
        body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin

        //parent the meshes
        box.parent = body;
        body.parent = outer;

        return {
            mesh: outer as Mesh,
        };
    }
}