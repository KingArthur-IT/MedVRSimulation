import * as THREE from 'three';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';
import { objectsParams } from './sceneObjects.js'

function addPolutionDecals(scene){
	const loader = new THREE.TextureLoader();
	const decalTexture = loader.load('./assets/img/COVID_contamination_mark.png', function (texture) {
		texture.minFilter = THREE.NearestFilter;
	});

	const decalTextureMaterial = new THREE.MeshPhongMaterial({
		map: decalTexture,
		flatShading: false,
		shininess: 30,
		transparent: true,
		depthTest: true,
		depthWrite: false,
		polygonOffset: true,
		polygonOffsetFactor: - 4,
		wireframe: false
	});
	
	objectsParams.decals.forEach(item => {
		const decalGeometry = new DecalGeometry(
			scene.getObjectByName(item.objName), 
			item.position, 				
			item.orientation, 	
			item.scale	
		);
		const decalMesh = new THREE.Mesh(decalGeometry, decalTextureMaterial);
		decalMesh.name = item.decalName;
		//decalMesh.visible = false;
		scene.add(decalMesh);
	})
}

function removeDecalsFromScene(scene){
	objectsParams.decals.forEach(item => {
		scene.remove(scene.getObjectByName(item.decalName));
	})
}

export { addPolutionDecals, removeDecalsFromScene }