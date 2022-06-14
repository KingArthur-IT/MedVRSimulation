import * as THREE from 'three';
import { objectsParams } from './sceneObjects.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { loadedObjects } from './preloader.js'

function addInteractiveObject(scene, camera, fileName, position, scale, objName, 
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

function addObjectToScene(scene, fileName, objectName, position, scale, rotation, isVisible = false){
    let Obj = new THREE.Object3D();
    Obj.visible = isVisible;
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