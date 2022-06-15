import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import ThreeMeshUI from "three-mesh-ui";
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';
//modules
import { addPreloaderObjects, loaderObjects, setIsSceneLoadedValue, getIsSceneLoadedValue, loadedObjects } from './modules/preloader.js'
import { objectsParams } from './modules/sceneObjects.js'
import { addInteractiveObject, addObjectToScene } from './modules/addObjects.js'
import { hoverObjectsList,
	IntroObjects, QuizzObjects, correctIncorrectObjects, infoObjectsMediumText, infoObjectsMediumTextImg,
    infoObjectsSmall, successObjects,
    createSuccessPopup, createIntroPopup, createInfoSmall, createInfoMediumText, createInfoMediumTextImg,
    createCorrectIncorrectPopup, createQuizzWindow, createInfoPopup, createConfidenceWindow } from './modules/windowsUI.js'

let camera, scene, renderer;

let controller1, controller2;
let controllerGrip1, controllerGrip2;
let pickHelper;
let PPE_DATA;
let roomNum = 1;

let selectedQuizzBtns = [];
let selectedPutOnObjects = ''

let putOnObjects = {
	correctObjectName : '',
	interactiveObject : []
}

let quizzSelectedBtnName = '';

let simulationStep = -1;
let stepSimType = "";

class App {
	async start(){
		//scene
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x505050 );
		camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
		camera.position.set( 0, 1, 0 );
		scene.add(camera)

		scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
		const light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );

		addPreloaderObjects(scene);

		//render
		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.outputEncoding = THREE.sRGBEncoding;
		renderer.xr.enabled = true;
		document.body.appendChild( renderer.domElement );
		document.body.appendChild( VRButton.createButton( renderer ) );

		animate();

		await fetch('./build/ppe.json', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'}
		})
			.then(async (response) => {
				if (response.ok){
					PPE_DATA = await response.json();
					this.init();
				}
			})
	}
	init() {
		//Room
		addObjectToScene(scene, objectsParams.room.fileName, objectsParams.room.objName, objectsParams.room.position, objectsParams.room.scale, objectsParams.room.rotation);	
		//body
		addInteractiveObject(	scene, camera,
					objectsParams.body.fileName, 
					objectsParams.body.position,
					objectsParams.body.scale,
					objectsParams.body.objName,
					objectsParams.body.collisionGeometry,
					objectsParams.body.collisionPosition,
					objectsParams.body.collisionSize
				);
		//interactive elements
		for (var i in objectsParams.interactiveObjectList) {
			const element = objectsParams.interactiveObjectList[i];
			addInteractiveObject(	scene, camera,
						element.fileName, 
						element.position,
						element.scale,
						element.objName,
						element.collisionGeometry,
						element.collisionPosition,
						element.collisionSize
			);
		}
		//clothes
		for (var i in objectsParams.clothesObjectList) {
			const element = objectsParams.clothesObjectList[i];
			addObjectToScene(scene, element.fileName + '.fbx', element.objName, objectsParams.body.position, element.scale, element.rotation);
		}
		//1st Room
		for (var i in objectsParams.firstRoomObjectList){
			const element = objectsParams.firstRoomObjectList[i];
			addObjectToScene(scene, element.fileName + '.fbx', element.objName, element.position, element.scale, element.rotation)
		}
		//patient Room
		for (var i in objectsParams.secondRoomObjectList){
			const element = objectsParams.secondRoomObjectList[i];
			addObjectToScene(scene, element.fileName + '.fbx', element.objName, element.position, element.scale, element.rotation)
		}

		//window with btns
		createQuizzWindow(scene);
		createCorrectIncorrectPopup(scene);
		createIntroPopup(scene);
		createSuccessPopup(scene);
		createInfoSmall(scene);
		createInfoMediumText(scene);
		createInfoMediumTextImg(scene);
		createConfidenceWindow(scene);
		//tooltips
		objectsParams.interactiveObjectList.forEach((item) => {
			createInfoPopup(scene, item.objName, item.popupPosition, 'Put on');
		})
		scene.getObjectByName('PopupGlovesPatientRoom').rotation.y = Math.PI * 0.5;
		createInfoPopup(scene, objectsParams.body.objName, objectsParams.body.popupPosition, 'Interact');

		window.addEventListener( 'resize', onWindowResize );

		// controllers
		function onSelectStart() {
			this.userData.isSelecting = true;
		}
		function onSelectEnd() {
			this.userData.isSelecting = false;
		}
		controller1 = renderer.xr.getController( 0 );
		controller1.addEventListener( 'selectstart', onSelectStart );
		controller1.addEventListener( 'selectend', onSelectEnd );
		controller1.addEventListener( 'connected', function ( event ) {
			this.add( buildController( event.data ) );
		} );
		controller1.addEventListener( 'disconnected', function () {
			this.remove( this.children[ 0 ] );
		} );
		scene.add( controller1 );

		controller2 = renderer.xr.getController( 1 );
		controller2.addEventListener( 'selectstart', onSelectStart );
		controller2.addEventListener( 'selectend', onSelectEnd );
		controller2.addEventListener( 'connected', function ( event ) {
			this.add( buildController( event.data ) );
		} );
		controller2.addEventListener( 'disconnected', function () {
			this.remove( this.children[ 0 ] );
		} );
		scene.add( controller2 );

		const controllerModelFactory = new XRControllerModelFactory();

		controllerGrip1 = renderer.xr.getControllerGrip( 0 );
		controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
		scene.add( controllerGrip1 );

		controllerGrip2 = renderer.xr.getControllerGrip( 1 );
		controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
		scene.add( controllerGrip2 );	

		pickHelper = new ControllerPickHelper(scene);
	}
}

class ControllerPickHelper extends THREE.EventDispatcher {
    constructor(scene) {
      super();
      this.raycaster = new THREE.Raycaster();
      this.objectToColorMap = new Map();
      this.controllerToObjectMap = new Map();
      this.tempMatrix = new THREE.Matrix4();

      const pointerGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1),
      ]);

      this.controllers = [];

	  //--- startClick ----
      const selectListener = (event) => {
        const controller = event.target;
        const selectedObject = this.controllerToObjectMap.get(event.target);
        if (selectedObject) {
          this.dispatchEvent({type: event.type, controller, selectedObject});
        }
		//console.log('click', event)
		if (event.type != 'selectstart')
			return;

		this.tempMatrix.identity().extractRotation(controller.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

		//find intersects
        const intersections = this.raycaster.intersectObjects(scene.children, true);
		//console.log(intersections)
		const isQuizzVisible = scene.getObjectByName(QuizzObjects.QuizzContainerName).visible;
		const isConfidenceVisible = scene.getObjectByName('ConfidenceWindow').visible;
		const isCorrectPopupVisible = scene.getObjectByName(correctIncorrectObjects.containerName).visible;
		intersections.forEach(intersect => {
			if (intersect != undefined && intersect.object.type == 'Mesh') { 
				if (stepSimType.includes('intro')){
					if (intersect.object.name == "MeshUI-Frame"){
						if (intersect.object.parent.children[1]?.name === 'nextBtn'){
							simulationStep++;
							showCurrentSimulationStep();
						}						
						if (intersect.object.parent.children[1]?.name === 'prevBtn'){
							simulationStep--;
							showCurrentSimulationStep();
						}
					}
				}
				if (stepSimType.includes('info')){
					if (intersect.object.name == "MeshUI-Frame"){
						let objName = intersect.object.parent.children[1]?.name;
						if (
							(objName === 'okBtnInfoMediumTextImg' && stepSimType === 'info-md-text-img') ||
							(objName === 'okBtnInfoMediumText' && stepSimType === 'info-md-text') ||
							(objName === 'okBtnInfoSmall' && stepSimType === 'info-sm')
						){
							simulationStep++;
							showCurrentSimulationStep();
						}	
					}
				}
				if (stepSimType === 'quizz'){
					if (intersect.object.parent.name === QuizzObjects.correctHighlightedObjName &&
						!isQuizzVisible && !isCorrectPopupVisible){
						scene.getObjectByName(QuizzObjects.QuizzContainerName).visible = true;
					}
					if (intersect.object.name == "MeshUI-Frame" && isQuizzVisible)
						if (intersect.object.parent.children[1]?.name.includes('quizz-btn')){
							const btnName = intersect.object.parent.children[1].name;
							const wasBtnClicked = (selectedQuizzBtns.some((i) => {return i === btnName}));
							if (wasBtnClicked) return;
							scene.getObjectByName(QuizzObjects.QuizzContainerName).visible = false;
							quizzSelectedBtnName = btnName;
							scene.getObjectByName('ConfidenceWindow').visible = true;
							stepSimType = 'confidenceQuizz';
						}
				}
				if (stepSimType === 'confidenceQuizz'){
					if (intersect.object.name == "MeshUI-Frame" && isConfidenceVisible)
						if (intersect.object.parent.children[1]?.name.includes('ConfidenceBtn')){
							//const btnName = intersect.object.parent.children[1].name;
							scene.getObjectByName('ConfidenceWindow').visible = false;
							if (quizzSelectedBtnName === QuizzObjects.correctQuizzBtnName){
								simulationStep++;
								selectedQuizzBtns = [];
								quizzSelectedBtnName = '';
								showCurrentSimulationStep();
							}
							else {
								selectedQuizzBtns.push(quizzSelectedBtnName);
								correctIncorrectObjects.contentTextObj.set({content: 'Incorrect.\nPlease try again.'});
								scene.getObjectByName(correctIncorrectObjects.containerName).visible = true;
								quizzSelectedBtnName = '';
								setTimeout(() => {
									scene.getObjectByName(correctIncorrectObjects.containerName).visible = false;
									showCurrentSimulationStep();
								}, 2000);
							}
						}
				}
				if (stepSimType === 'put-on'){
					const isInteractiveObjClicked = putOnObjects.interactiveObject.some((item) => {
						return intersect.object.name === item  + 'Collider'
					})
					if (intersect.object.name === putOnObjects.correctObjectName + 'Collider' || isInteractiveObjClicked){
						stepSimType = 'confidencePutOn';
						selectedPutOnObjects = intersect.object.name;
						scene.getObjectByName('ConfidenceWindow').visible = true;
					}
				}
				if (stepSimType === 'confidencePutOn'){
					if (intersect.object.name == "MeshUI-Frame" && isConfidenceVisible)
						if (intersect.object.parent.children[1]?.name.includes('ConfidenceBtn')){
							scene.getObjectByName('ConfidenceWindow').visible = false;
							if (selectedPutOnObjects === putOnObjects.correctObjectName + 'Collider'){
								if ( putOnObjects.correctObjectName !== 'GlovesPatientRoom')
									scene.getObjectByName('Body' + putOnObjects.correctObjectName).visible = true;
								else scene.getObjectByName('BodyGloves').visible = true;
								if (putOnObjects.correctObjectName !== 'Gloves' && putOnObjects.correctObjectName !== 'GlovesPatientRoom')
									scene.getObjectByName(putOnObjects.correctObjectName).visible = false;
								simulationStep++;
								showCurrentSimulationStep();
							} else
								putOnObjects.interactiveObject.forEach((element) => {
									if (selectedPutOnObjects === element  + 'Collider'){
										correctIncorrectObjects.contentTextObj.set({content: 'Incorrect.\nPlease try again.'});
										scene.getObjectByName(correctIncorrectObjects.containerName).visible = true;
										setTimeout(() => {
											scene.getObjectByName(correctIncorrectObjects.containerName).visible = false;
										}, 2000);
										stepSimType = 'put-on';
									}
								});
							selectedPutOnObjects = '';
						}
				}
				if (stepSimType === 'sim-end'){
					if (intersect.object.name == "MeshUI-Frame")
						if(intersect.object.parent.children[1].name === 'successOk'){
							simulationStep = 0;
							showCurrentSimulationStep();
							objectsParams.interactiveObjectList.forEach((obj) => {
								scene.getObjectByName(obj.objName).visible = true;
							})
							objectsParams.clothesObjectList.forEach((obj) => {
								scene.getObjectByName(obj.objName).visible = false;
							})
						}
					
				}
				/*
				//close popup
				if (intersect.object.name == 'Close'){
					showCloseWindow(false);
				}
				if (intersect.object.name == 'Ok'){
					restartSimulation();
				}
				*/
			}
		});
      };
	  //------- endClick -------------
      const endListener = () => {
        
      };
	  //------- end of endClick -------------
      for (let i = 0; i < 2; ++i) {
        const controller = renderer.xr.getController(i);
        //controller.addEventListener('select', selectListener);
        controller.addEventListener('selectstart', selectListener);
        controller.addEventListener('selectend', endListener);
        scene.add(controller);

        const line = new THREE.Line(pointerGeometry);
        line.scale.z = 20;
        controller.add(line);
        this.controllers.push({controller, line});
      }
    }
	//reset
    reset() {
      // restore the colors
      this.objectToColorMap.forEach((color, object) => {
        object.material.emissive.setHex(color);
      });
      this.objectToColorMap.clear();
      this.controllerToObjectMap.clear();
    }
	//update - for hover
    update(scene) {
      this.reset();

	  hoverObjectsList.forEach(el => {
		const wasSelected = selectedQuizzBtns.some((i) => { return i === el.name});
		if (el.state === 'selected' && !wasSelected){
			scene.getObjectByName(el.name).parent.setState('normal');
			el.state = "normal";
		}
		if (wasSelected){
			scene.getObjectByName(el.name).parent.setState('selected');
			el.state = "selected";
		}
	  });

      for (const {controller, line} of this.controllers) {
        this.tempMatrix.identity().extractRotation(controller.matrixWorld);
        this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
        this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

        const intersections = this.raycaster.intersectObjects(scene.children, true);
		line.scale.z = 20;
		//hover
		intersections.forEach(intersect => {
			if (intersect != undefined) {
				hoverObjectsList.forEach(el => {
					if (intersect.object.name == "MeshUI-Frame"){
						if (intersect.object.parent.children[1]?.name == el.name){
							scene.getObjectByName(el.name).parent.setState('selected');
							el.state = "selected";
						}
					}
				});
			}
		});
      }
    }
  }

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function buildController( data, name ) {
	let geometry, material;
	switch ( data.targetRayMode ) {
		case 'tracked-pointer':
			geometry = new THREE.BufferGeometry();
			geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
			geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );

			material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );

			return new THREE.Line( geometry, material );

		case 'gaze':
			geometry = new THREE.RingGeometry( 0.02, 0.04, 32 ).translate( 0, 0, - 1 );
			material = new THREE.MeshBasicMaterial( { opacity: 0.5, transparent: true } );
			return new THREE.Mesh( geometry, material );
	}
}

function animate() {	
	renderer.setAnimationLoop( render );
}

function render() {
	//rotate loader cube
	if (!getIsSceneLoadedValue()) {
		scene.getObjectByName(loaderObjects.cubeObjectName).rotation.z += 0.03;
	}
	//chack for end of loader scene
	if (!getIsSceneLoadedValue() && Object.values(loadedObjects).every(i => i === true)){
		setTimeout(() => {
			setIsSceneLoadedValue(true);
			simulationStep = 0;
			showCurrentSimulationStep();

			Object.values(loaderObjects).forEach(i => {
				let object = scene.getObjectByName(i);
				scene.remove( object );
			})
			renderer.renderLists.dispose();
			}, 1000);
	} 
	//controller update
	if (getIsSceneLoadedValue())
		pickHelper.update(scene);

	ThreeMeshUI.update();
	renderer.render( scene, camera );
}

function addPolutionDecals(){
	//create decal
	const decalMaterial = new THREE.MeshPhongMaterial({
		color: new THREE.Color(0xffffff),
		flatShading: false,
		shininess: 30,
		transparent: true,
		depthTest: true,
		depthWrite: false,
		polygonOffset: true,
		polygonOffsetFactor: - 4,
		wireframe: false
	});

	const loader = new THREE.TextureLoader();
	const decalTexture = loader.load('./assets/img/polution.png', function (texture) {
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

function removeDecalsFromScene(){
	objectsParams.decals.forEach(item => {
		scene.remove(scene.getObjectByName(item.decalName));
	})
}

function changeAllInfoPopupsVisibility(val){
	objectsParams.interactiveObjectList.forEach((item) => {
		scene.getObjectByName('Popup' + item.objName).visible = val;
	})
	scene.getObjectByName('PopupBody').visible = val;
}

function showCurrentSimulationStep(){
	scene.getObjectByName(IntroObjects.IntroContainerName).visible = false;
	scene.getObjectByName(QuizzObjects.QuizzContainerName).visible = false;
	scene.getObjectByName(correctIncorrectObjects.containerName).visible = false;
	scene.getObjectByName(successObjects.containerName).visible = false;
	scene.getObjectByName(infoObjectsMediumTextImg.containerName).visible = false;
	scene.getObjectByName(infoObjectsMediumText.containerName).visible = false;
	scene.getObjectByName(infoObjectsSmall.containerName).visible = false;
	changeAllInfoPopupsVisibility(false);
	document.getElementById('video').pause();

	stepSimType = PPE_DATA.vrSim.sim[simulationStep].type;
	
	if (PPE_DATA.vrSim.sim[simulationStep].type.includes('intro')){
		//intro container
		scene.getObjectByName(IntroObjects.IntroContainerName).visible = true;
		//title
		IntroObjects.titleTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].title});
		//btns
		scene.getObjectByName(IntroObjects.prevBtnObjName).parent.visible = PPE_DATA.vrSim.sim[simulationStep].prevBtnVisibility;
		scene.getObjectByName(IntroObjects.nextBtnObjName).parent.visible = PPE_DATA.vrSim.sim[simulationStep].nextBtnVisibility;
		//media mesh
		document.getElementById('video').pause();
		scene.getObjectByName(IntroObjects.mediaContainerObjName).material.map = null;
		scene.getObjectByName(IntroObjects.mediaContainerObjName).visible = false;
		//content text
		IntroObjects.contentTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].content});
		
		if (PPE_DATA.vrSim.sim[simulationStep].type === "intro-img"){
			const loader = new THREE.TextureLoader();  
			let map = loader.load(PPE_DATA.vrSim.sim[simulationStep].img, function (texture) {
				texture.minFilter = THREE.LinearFilter;
			});
			scene.getObjectByName(IntroObjects.mediaContainerObjName).visible = true;
			scene.getObjectByName(IntroObjects.mediaContainerObjName).material.map = map;
			scene.getObjectByName(IntroObjects.mediaContainerObjName).material.needsUpdate = true;
		}
		if (PPE_DATA.vrSim.sim[simulationStep].type === "intro-video"){
			scene.getObjectByName(IntroObjects.mediaContainerObjName).visible = true;
			const video = document.getElementById('video');
			let videoTexture = new THREE.VideoTexture( video );		
			videoTexture.flipY = true;

			scene.getObjectByName(IntroObjects.mediaContainerObjName).material.map = videoTexture;
			video.play();
			video.currentTime = PPE_DATA.vrSim.sim[simulationStep].time;
		}
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'info-md-text-img'){
		//intro container
		scene.getObjectByName(infoObjectsMediumTextImg.containerName).visible = true;
		//title
		infoObjectsMediumTextImg.titleTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].title});
		//content text
		infoObjectsMediumTextImg.contentTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].content});
		//img
		const loader = new THREE.TextureLoader();  
		loader.load(PPE_DATA.vrSim.sim[simulationStep].img, function (texture) {
			//texture.minFilter = THREE.LinearFilter;
			infoObjectsMediumTextImg.imgContainerObjName.set({ backgroundTexture: texture });
		});
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'info-md-text'){
		//intro container
		scene.getObjectByName(infoObjectsMediumText.containerName).visible = true;
		//title
		infoObjectsMediumText.titleTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].title});
		//content text
		infoObjectsMediumText.contentTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].content});
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'info-sm'){
		//intro container
		scene.getObjectByName(infoObjectsSmall.containerName).visible = true;
		//title
		infoObjectsSmall.titleTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].title});
		//content text
		infoObjectsSmall.contentTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].content});
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'quizz'){
		PPE_DATA.vrSim.sim[simulationStep].highlightedObjectNames.forEach(element => {
			scene.getObjectByName('Popup' + element).visible = true;
		}); 
		//title
		QuizzObjects.titleTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].title});
		//btns
		QuizzObjects.btnTextObj[0].set({content: PPE_DATA.vrSim.sim[simulationStep].btnText1});
		QuizzObjects.btnTextObj[1].set({content: PPE_DATA.vrSim.sim[simulationStep].btnText2});
		QuizzObjects.btnTextObj[2].set({content: PPE_DATA.vrSim.sim[simulationStep].btnText3});
		QuizzObjects.btnTextObj[3].set({content: PPE_DATA.vrSim.sim[simulationStep].btnText4});
		//correct`s
		QuizzObjects.correctHighlightedObjName = PPE_DATA.vrSim.sim[simulationStep].correctObjectName;
		QuizzObjects.correctQuizzBtnName = PPE_DATA.vrSim.sim[simulationStep].correctAnswer;
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'put-on'){
		PPE_DATA.vrSim.sim[simulationStep].glowObjectsName.forEach(element => {
			scene.getObjectByName('Popup' + element).visible = true;
		})
		putOnObjects.correctObjectName = PPE_DATA.vrSim.sim[simulationStep].correctOnjectName;
		putOnObjects.interactiveObject = PPE_DATA.vrSim.sim[simulationStep].interactiveObjectsName;
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'sim-end'){
		removeDecalsFromScene();
		//title
		successObjects.titleTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].title});
		//content
		successObjects.contentTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].content});
		setTimeout(() => {
			scene.getObjectByName(successObjects.containerName).visible = true;
		}, 2000);
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'take-off'){
		const objName = PPE_DATA.vrSim.sim[simulationStep].objectName;
		scene.getObjectByName('Body' + objName).visible = false;
		simulationStep++;
		showCurrentSimulationStep();
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'init-med-objects'){
		scene.getObjectByName(objectsParams.room.objName).visible = true;
		scene.getObjectByName(objectsParams.body.objName).visible = true;
		objectsParams.interactiveObjectList.forEach((e) => {
			if (e.objName !== 'GlovesPatientRoom')
				scene.getObjectByName(e.objName).visible = true;
			// scene.getObjectByName(e.objName).position.copy(e.position);
			// scene.getObjectByName(e.objName).rotation.setFromVector3(e.rotation);
		});
		objectsParams.firstRoomObjectList.forEach((el) => {
			scene.getObjectByName(el.objName).visible = true;
		})
		simulationStep++;
		showCurrentSimulationStep();
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'change-room'){
		if (roomNum === 1){
			//1st Room
			for (var i in objectsParams.firstRoomObjectList){
				const element = objectsParams.firstRoomObjectList[i];
				scene.getObjectByName(element.objName).visible = false;
			}
			//patient Room
			for (var i in objectsParams.secondRoomObjectList){
				const element = objectsParams.secondRoomObjectList[i];
				scene.getObjectByName(element.objName).visible = true;
			}
			//interactive objects
			objectsParams.interactiveObjectList.forEach((i) => {
				scene.getObjectByName(i.objName).visible = false;
			})
			scene.getObjectByName('GlovesPatientRoom').visible = true;
			//change Body position
			scene.getObjectByName('Body').position.copy(objectsParams.body.secondRoomPosition);
			scene.getObjectByName('Body').rotation.setFromVector3(objectsParams.body.secondRoomRotation);
			scene.getObjectByName('BodyCollider').position.copy(objectsParams.body.secondRoomСollisionPosition);
			scene.getObjectByName('PopupBody').position.copy(objectsParams.body.secondRoomPopupPosition);
			scene.getObjectByName('PopupBody').rotation.setFromVector3(objectsParams.body.secondRoomPopupRotation);
			//clothes objects
			objectsParams.clothesObjectList.forEach((i) => {
				scene.getObjectByName(i.objName).position.copy(objectsParams.body.secondRoomPosition);
				scene.getObjectByName(i.objName).rotation.setFromVector3(objectsParams.body.secondRoomRotation);
			})
			roomNum = 2;
		} else {
			//1st Room
			for (var i in objectsParams.firstRoomObjectList){
				const element = objectsParams.firstRoomObjectList[i];
				scene.getObjectByName(element.objName).visible = true;
			}
			//patient Room
			for (var i in objectsParams.secondRoomObjectList){
				const element = objectsParams.secondRoomObjectList[i];
				scene.getObjectByName(element.objName).visible = false;
			}
			scene.getObjectByName('GlovesPatientRoom').visible = false;
			scene.getObjectByName('Gloves').visible = true;
			//change Body position
			scene.getObjectByName('Body').position.copy(objectsParams.body.position);
			scene.getObjectByName('Body').rotation.setFromVector3(objectsParams.body.rotation);
			scene.getObjectByName('BodyCollider').position.copy(objectsParams.body.collisionPosition);
			scene.getObjectByName('PopupBody').position.copy(objectsParams.body.popupPosition);
			scene.getObjectByName('PopupBody').rotation.setFromVector3(new THREE.Vector3(0.0, 0.0, 0.0));
			//clothes objects
			objectsParams.clothesObjectList.forEach((i) => {
				scene.getObjectByName(i.objName).position.copy(objectsParams.body.position);
				scene.getObjectByName(i.objName).rotation.setFromVector3(objectsParams.body.rotation);
			})
			roomNum = 1;
		}
		
		simulationStep++;
		showCurrentSimulationStep();
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'create-polution-decals'){
		//addPolutionDecals();
		simulationStep++;
		showCurrentSimulationStep();
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'polution-decals'){
		// objectsParams.decals.forEach(i => {
		// 	scene.getObjectByName(i.decalName).visible = 
		// 		PPE_DATA.vrSim.sim[simulationStep].visibleDecals.some(el => el == i.decalName);
		// })
		simulationStep++;
		showCurrentSimulationStep();
	}
}

export default App;