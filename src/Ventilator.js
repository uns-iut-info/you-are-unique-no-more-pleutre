import { ArcRotateCamera, Vector3, Mesh, PointLight, ParticleSystem, Texture, Vector2 } from "@babylonjs/core";

// to import in app.ts such as 
// import { Ventilator } from "./Ventilator";

export class Ventilator {

    constructor() { };

    createVentilator = function (scene, canvas) {

        var babylon_textures_url = "https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/Playground/textures/cloud.png";
        // var scene = new Scene(engine);
        // Setup environment
        var light0 = new PointLight("Omni", new Vector3(0, 2, 8), scene);
        var camera = new ArcRotateCamera("ArcRotateCamera", 1, 0.8, 20, new Vector3(0, 0, 0), scene);
        camera.attachControl(canvas, true);

        // Fountain object
        var fountain = Mesh.CreateBox("foutain", 1.0, scene);

        // Create a particle system
        // https://doc.babylonjs.com/divingDeeper/particles/particle_system/customizingParticles
        var particleSystem = new ParticleSystem("particles", 100, scene);
        //Texture of each particle
        particleSystem.particleTexture = new Texture(babylon_textures_url, scene);

        // Where the particles come from
        particleSystem.emitter = fountain; // the starting object, the emitter
        particleSystem.minEmitBox = new Vector3(1, 0, 1); // Starting all from
        particleSystem.maxEmitBox = new Vector3(1, 0, 1); // To...

        // Colors of all particles
        // particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
        // particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
        // particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

        // Size of each particle (random between...
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;

        // Life time of each particle (random between...
        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 3;

        // Emission rate
        particleSystem.emitRate = 1500;

        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        // particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;

        // Set the gravity of all particles
        particleSystem.gravity = new Vector3(0, -5, 0);

        // Direction of each particle after it has been emitted
        particleSystem.direction1 = new Vector3(-1, 8, -1);
        particleSystem.direction2 = new Vector3(1, 8, 1);

        // Angular speed, in radians
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        // Speed
        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 3;
        particleSystem.updateSpeed = 0.005;

        // const once = new Array(particleSystem.getCapacity()).fill(false);
        const angleMap = new  Map();
        const radiusMap = new Map();

        // set Twist direction for each particles
        particleSystem.updateFunction = function (particles) {
            // console.log(particles.length);
            for (var index = 0; index < particles.length; index++) {

                var particle = particles[index];
                particle.age += this._scaledUpdateSpeed;
                // var rate = 1;
                particleSystem.finalSize = 1;
                // if (particle.age < particle.lifeTime * rate && particle.lifeTime > 1.4) {
                //     particle.size = particleSystem.finalSize * particle.age / (particle.lifeTime * rate);
                // }

                if (particle.age >= particle.lifeTime) { // Recycle
                    this.recycleParticle(particle);
                    radiusMap.delete(particle.id);
                    angleMap.delete(particle.id);
                    // index--;
                    // continue;
                }
                else {
                    if(!radiusMap.has(particle.id)) {
                        // console.log("New particle : " + particle.id);
                        radiusMap.set(
                            particle.id, 
                            Math.sqrt(
                                Math.pow(fountain.position._x - particle.position._x, 2) +
                                Math.pow(fountain.position._z - particle.position._z, 2)
                            ) * 12
                        );
                    }
                    if(!angleMap.has(particle.id)) {
                        angleMap.set(
                            particle.id,
                            Math.atan(
                                Math.abs(particle.position._z - fountain.position._z)
                                / Math.abs(particle.position._x - fountain.position._x)
                            ) + Math.PI / 2
                        );
                    }
                    const step = 0.05;
                    const direction = new Vector2(
                        fountain.position._x + Math.cos(angleMap.get(particle.id)) * radiusMap.get(particle.id),
                        fountain.position._z + Math.sin(angleMap.get(particle.id)) * radiusMap.get(particle.id)
                    );
                    angleMap.set(particle.id, angleMap.get(particle.id) + step);
                    // if(particle.id == 10) 
                    //     console.log(angleMap.get(10));

                    var newDirection = new Vector3(direction.x, particle.direction._y, direction.y);
                    particle.direction = newDirection;

                    particle.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
                    particle.position.addInPlace(this._scaledDirection);

                    this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
                    particle.direction.addInPlace(this._scaledGravity);
                }
            }
        }

        // Start the particle system
        particleSystem.start();

    }

}