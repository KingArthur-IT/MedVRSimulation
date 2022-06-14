import * as THREE from 'three';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import ThreeMeshUI from "three-mesh-ui";

const loaderObjects = {
	roomObjectName: 'LoaderRoom',
	textObjectName: 'LoaderTextContainer',
	cubeObjectName: 'LoaderCube'
}

let loadedObjects = {
	Room: false,
	Body: false,
	Robe: false,
	Mask: false,
	Glasses: false,
	Gloves: false,
    BodyRobe: false,
    BodyMask: false,
    BodyGlasses: false,
    BodyGloves: false,
    Bed: false,
    Patient: false,
    WallEquipment: false,
    Table: false,
    EmptyTrash: false,
    FullTrash: false
}

let isSceneLoaded = false;

function setIsSceneLoadedValue(val){ isSceneLoaded = val };
function getIsSceneLoadedValue(){ return isSceneLoaded }

function addPreloaderObjects(scene){
    //loader room
    const room = new THREE.LineSegments(
        new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
        new THREE.LineBasicMaterial( { color: 0x808080 } )
    );
    room.name = loaderObjects.roomObjectName;
    scene.add( room );

    //UI text
    const container = new ThreeMeshUI.Block({
        width: 3.0,
        fontFamily: "./assets/Roboto-msdf.json",
        fontTexture: "./assets/Roboto-msdf.png",
        backgroundColor: new THREE.Color(0xe2e2e2),
        backgroundOpacity: 1,
    });
    const textBlock = new ThreeMeshUI.Block({
        height: 0.5,
        width: 3.0,
        alignContent: "center",
        justifyContent: "center",
        padding: 0.1,
        backgroundColor: new THREE.Color(0xe2e2e2),
    });   
    container.add(textBlock);
    const text = new ThreeMeshUI.Text({
        content: "Loading. Please wait",
        fontColor: new THREE.Color(0x3e3e3e),
        fontSize: 0.2,
    });
    textBlock.add(text);
    container.position.set(0.0, 2.6, -3.0);
    container.name = loaderObjects.textObjectName;
    scene.add(container);

    //box
    const boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
    const boxMaterial = new THREE.MeshStandardMaterial( {color: 0x2020ff} );
    const cube = new THREE.Mesh( boxGeometry, boxMaterial );
    cube.position.set(0.0, 1.8, -3.0);
    cube.name = loaderObjects.cubeObjectName;
    cube.rotation.x = 3.8;
    scene.add( cube );
}

export { addPreloaderObjects, loaderObjects, loadedObjects, setIsSceneLoadedValue, getIsSceneLoadedValue }