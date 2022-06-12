import * as THREE from 'three';
import { objectsParams } from './sceneObjects.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { loadedObjects } from './preloader.js'

function addInteractiveObject(scene, camera, fileName, position, glowPosition, scale, glowScale, objName, 
	collisionGeometry, collisionPosition, collisionSize
	)
{
	let Obj = new THREE.Object3D();
	Obj.visible = false;
	let fbxLoader = new FBXLoader();
	fbxLoader.setPath(objectsParams.modelPath);
	fbxLoader.load(
		fileName + '.fbx',
		(object) => {
			object.name = objName;
			//do glasses more visible
			if (objName === 'Glasses'){
				object.children[0].material.color.r = 0.0;
				object.children[0].material.color.g = 0.0;
				object.children[0].material.color.b = 0.0;
			}
			Obj.add(object);
		},
		(xhr) => {
			if ( (xhr.loaded / xhr.total) === 1)
				loadedObjects[objName] = true;
		}
	)
	Obj.position.copy(position);
	Obj.scale.copy(scale);
	Obj.name = objName;

	scene.add(Obj);

	//glow obj
	var glowMaterial = new THREE.ShaderMaterial( 
		{
			uniforms: 
			{ 
				"base":   { type: "f", value: 0.0 },
				"p":   { type: "f", value: 0.0 },
				glowColor: { type: "c", value: new THREE.Color(0x0000FF) },
				viewVector: { type: "v3", value: camera.position }
			},
			vertexShader:   `uniform vec3 viewVector;
							uniform float base;
							uniform float p;
							varying float intensity;
							void main() 
							{
								vec3 vNormal = normalize( normalMatrix * normal );
								vec3 vNormel = normalize( normalMatrix * viewVector );
								intensity = pow( base - dot(vNormal, vNormel), p );
								
								gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
							}`,
			fragmentShader: `uniform vec3 glowColor;
							varying float intensity;
							void main() 
							{
								vec3 glow = glowColor * intensity;
								gl_FragColor = vec4( glow, 1.0 );
							}`,
			side: THREE.BackSide,
			blending: THREE.AdditiveBlending,
			transparent: true
	});

	let ObjGlow = new THREE.Object3D();
	ObjGlow.visible = false;
	fbxLoader = new FBXLoader();
	fbxLoader.setPath(objectsParams.modelPath);
	fbxLoader.load(
		fileName + '.fbx',
		(object) => {
			object.traverse( function ( child ) {
				if ( child.isMesh ) {
					child.material = glowMaterial
				}
			})
			ObjGlow.add(object);
		},
		(xhr) => {
			if ( (xhr.loaded / xhr.total) === 1)
				loadedObjects[objName + 'Glow'] = true;
		}
	)
	
	ObjGlow.position.copy(glowPosition);
	ObjGlow.scale.copy(glowScale);
	ObjGlow.name = objName + 'Glow';

	scene.add(ObjGlow);

	//collider
	let geometry;
	if (collisionGeometry === 'Box')
		geometry = new THREE.BoxGeometry(collisionSize.x, collisionSize.y, collisionSize.z)
	else geometry = new THREE.SphereGeometry(collisionSize.x, collisionSize.y, collisionSize.z);
	const material = new THREE.MeshBasicMaterial( { color: 0xffff00, transparent: true, opacity: 0.5 } );
	const collider = new THREE.Mesh( geometry, material );
	collider.position.copy(collisionPosition);
	collider.name = objName + 'Collider';
	collider.visible = false;
	scene.add( collider );

	return Obj;
}

function addObjectToScene(scene, fileName, objectName, position, scale, rotation){
    let Obj = new THREE.Object3D();
    Obj.visible = false;
    let fbxLoader = new FBXLoader();
    fbxLoader.setPath(objectsParams.modelPath);
    fbxLoader.load(
        fileName,
        (object) => {
            object.name = objectName;
            Obj.add(object)
        }, (xhr) => {
            if ( (xhr.loaded / xhr.total) === 1){
                loadedObjects[objectName] = true;
            }
        },
    )
    Obj.scale.copy(scale);
    Obj.position.copy(position); 
	Obj.rotation.setFromVector3(rotation);
    Obj.name = objectName;
    scene.add(Obj);
}


export { addInteractiveObject, addObjectToScene }