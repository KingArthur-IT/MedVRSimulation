import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import ThreeMeshUI from "three-mesh-ui";
import { vr_xapi_initialize_LRS, vr_xapi_sendprofiledata, vr_xapi_SaveAction, vr_xapi_SaveAssessment, vr_xapi_SaveCompletion } from './lrs/xAPIInterface'
//modules
import { addPreloaderObjects, loaderObjects, setIsSceneLoadedValue, getIsSceneLoadedValue, loadedObjects } from './modules/preloader.js'
import { objectsParams } from './modules/sceneObjects.js'
import { addInteractiveObject, addObjectToScene } from './modules/addObjects.js'
import { hoverObjectsList,
		IntroObjects, QuizzObjects, TFQuizzObjects, correctIncorrectObjects, infoObjectsMediumText, infoObjectsMediumTextImg,
		infoObjectsSmall, successObjects, infoObjectsMediumTextLargeImg,
		createSuccessPopup, createIntroPopup, createInfoSmall, createInfoMediumText, createInfoMediumTextImg, createInfoMediumTextLargeImg,
		createCorrectIncorrectPopup, createQuizzWindow, createInfoPopup, createConfidenceWindow, createTrueFalseQuizzWindow 
	} from './modules/windowsUI.js'
import { addPolutionDecals, removeDecalsFromScene } from './modules/decals'
import { createReportFirstWindow, reportUI, createReportFirstTableWindow, createReportConfidenceTableWindow, createReportDiagramWindow } from './modules/reportUI.js'

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

let lrsData = {
	wasSended: false,
	quizzData: {
		confidenceLevel: 0,
		questionID: 1,
		questionText: '',
		scoreValue: 0, 
		isCorrect: false,
		answerText: '',
		answerChoices: [
			{
			  "id": "1",
			  "description": {
				"en-US": "Incorrect"
			  }
			},
			{
			  "id": "2",
			  "description": {
				"en-US": "Correct"
			  }
			}
		  ]
	}
}

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

		const urlParams = (new URL(document.location)).searchParams;
		const username = urlParams.get('actorFirstName') + ' ' + urlParams.get('actorLastName');
		const userEmail = urlParams.get('actorEmail');
		console.log({name: username, mbox: userEmail})
		vr_xapi_initialize_LRS();
		vr_xapi_sendprofiledata({}, {name: username, mbox: userEmail});

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
		createInfoMediumTextLargeImg(scene);
		createConfidenceWindow(scene);
		createTrueFalseQuizzWindow(scene);
		createReportFirstWindow(scene);
		createReportFirstTableWindow(scene);
		createReportConfidenceTableWindow(scene);
		createReportDiagramWindow(scene);
		//tooltips
		objectsParams.interactiveObjectList.forEach((item) => {
			createInfoPopup(scene, item.objName, item.popupPosition, item.tooltipText, item.tooltopXScale);
		})
		scene.getObjectByName('PopupGlovesPatientRoom').rotation.y = Math.PI * 0.5;
		createInfoPopup(scene, objectsParams.body.objName, objectsParams.body.popupPosition, objectsParams.body.tooltipText, objectsParams.body.tooltopXScale);

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
		const isTFQuizzVisible = scene.getObjectByName(TFQuizzObjects.QuizzContainerName).visible;
		const isConfidenceVisible = scene.getObjectByName('ConfidenceWindow').visible;
		const isCorrectPopupVisible = scene.getObjectByName(correctIncorrectObjects.containerName).visible;
		let isNext = false, isPrev = false;
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
							(objName === 'okBtnInfoMediumTextLargeImg' && stepSimType === 'info-md-text-lg-img') ||
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
				if (stepSimType === 'tf-quizz'){
					if (intersect.object.name == "MeshUI-Frame" && isTFQuizzVisible)
						if (intersect.object.parent.children[1]?.name.includes('tf-quizz-btn')){
							const btnName = intersect.object.parent.children[1].name;
							scene.getObjectByName(TFQuizzObjects.QuizzContainerName).visible = false;
							quizzSelectedBtnName = btnName;
							scene.getObjectByName('ConfidenceWindow').visible = true;
							stepSimType = 'tf-confidenceQuizz';
						}
				}
				if (stepSimType === 'confidenceQuizz'){
					if (intersect.object.name == "MeshUI-Frame" && isConfidenceVisible)
						if (intersect.object.parent.children[1]?.name.includes('ConfidenceBtn')){
							scene.getObjectByName('ConfidenceWindow').visible = false;
							//lrs
							if (!lrsData.wasSended){
								if (intersect.object.parent.children[1]?.name === 'HighConfidenceBtn')
									lrsData.quizzData.confidenceLevel = 1.0;
								else lrsData.quizzData.confidenceLevel = 0.5;
								if (quizzSelectedBtnName === QuizzObjects.correctQuizzBtnName){
									lrsData.quizzData.answerText = 'Correct';
									lrsData.quizzData.isCorrect = true;
									lrsData.quizzData.scoreValue = 1;
								}
								else {
									lrsData.quizzData.answerText = 'Incorrect';
									lrsData.quizzData.isCorrect = false;
									lrsData.quizzData.scoreValue = 0;
								};
								vr_xapi_SaveAction(lrsData.quizzData.confidenceLevel, lrsData.quizzData.questionID, lrsData.quizzData.questionText + '?', lrsData.quizzData.scoreValue, lrsData.quizzData.isCorrect, lrsData.quizzData.answerText, lrsData.quizzData.answerChoices);
								lrsData.wasSended = true;
								lrsData.quizzData.questionID ++;
							};
							
							if (quizzSelectedBtnName === QuizzObjects.correctQuizzBtnName){
								simulationStep++;
								selectedQuizzBtns = [];
								quizzSelectedBtnName = '';
								showCurrentSimulationStep();
								lrsData.wasSended = false;
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
				if (stepSimType === 'tf-confidenceQuizz'){
					if (intersect.object.name == "MeshUI-Frame" && isConfidenceVisible)
						if (intersect.object.parent.children[1]?.name.includes('ConfidenceBtn')){
							scene.getObjectByName('ConfidenceWindow').visible = false;
							if (quizzSelectedBtnName === TFQuizzObjects.correctQuizzBtnName){
								correctIncorrectObjects.contentTextObj.set({content: 'Correct.'});
								scene.getObjectByName(correctIncorrectObjects.containerName).visible = true;
								quizzSelectedBtnName = '';
								selectedQuizzBtns = [];
								setTimeout(() => {
									simulationStep++;
									scene.getObjectByName(correctIncorrectObjects.containerName).visible = false;
									showCurrentSimulationStep();
								}, 2000);
							}
							else {
								correctIncorrectObjects.contentTextObj.set({content: 'Incorrect.'});
								scene.getObjectByName(correctIncorrectObjects.containerName).visible = true;
								quizzSelectedBtnName = '';
								setTimeout(() => {
									simulationStep++;
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
						selectedPutOnObjects = intersect.object.name.replace('Collider', '');
						scene.getObjectByName('ConfidenceWindow').visible = true;
					}
				}
				if (stepSimType === 'confidencePutOn'){
					if (intersect.object.name == "MeshUI-Frame" && isConfidenceVisible)
						if (intersect.object.parent.children[1]?.name.includes('ConfidenceBtn')){
							scene.getObjectByName('ConfidenceWindow').visible = false;
							//lrs
							if (!lrsData.wasSended){
								if (intersect.object.parent.children[1]?.name === 'HighConfidenceBtn')
									lrsData.quizzData.confidenceLevel = 1.0;
								else lrsData.quizzData.confidenceLevel = 0.5;
								if (selectedPutOnObjects === putOnObjects.correctObjectName){
									lrsData.quizzData.answerText = 'Correct';
									lrsData.quizzData.isCorrect = true;
									lrsData.quizzData.scoreValue = 1;
								}
								else {
									lrsData.quizzData.answerText = 'Incorrect';
									lrsData.quizzData.isCorrect = false;
									lrsData.quizzData.scoreValue = 0;
								};
								vr_xapi_SaveAction(lrsData.quizzData.confidenceLevel, lrsData.quizzData.questionID, lrsData.quizzData.questionText + '?', lrsData.quizzData.scoreValue, lrsData.quizzData.isCorrect, lrsData.quizzData.answerText, lrsData.quizzData.answerChoices);
								lrsData.wasSended = true;
								lrsData.quizzData.questionID ++;
							};

							if (selectedPutOnObjects === putOnObjects.correctObjectName){
								if ( putOnObjects.correctObjectName !== 'GlovesPatientRoom')
									scene.getObjectByName('Body' + putOnObjects.correctObjectName).visible = true;
								else scene.getObjectByName('BodyGloves').visible = true;
								if (putOnObjects.correctObjectName !== 'Gloves' && putOnObjects.correctObjectName !== 'GlovesPatientRoom')
									scene.getObjectByName(putOnObjects.correctObjectName).visible = false;
								simulationStep++;
								showCurrentSimulationStep();
								lrsData.wasSended = false;
							} else
								putOnObjects.interactiveObject.forEach((element) => {
									if (selectedPutOnObjects === element){
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
						if(intersect.object.parent.children[1]?.name === 'successOk'){
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
				if (stepSimType === 'report-first-table'){
					if (intersect.object.name == "MeshUI-Frame"){
						if (intersect.object.parent.children[1]?.name === 'nextReportFirstTableBtn'){
							isNext = true;
						}						
						if (intersect.object.parent.children[1]?.name === 'prevReportFirstTableBtn'){
							isPrev = true;
						}
					}
				}
				if (stepSimType === 'report-first'){
					if (intersect.object.name == "MeshUI-Frame"){
						if (intersect.object.parent.children[1]?.name === 'nextReportFirstBtn'){
							isNext = true;
						}						
						if (intersect.object.parent.children[1]?.name === 'prevReportFirstBtn'){
							isPrev = true;
						}
					}
				}
				if (stepSimType === 'report-confidence-table'){
					if (intersect.object.name == "MeshUI-Frame"){
						if (intersect.object.parent.children[1]?.name === 'nextReportConfidenceTableBtn'){
							isNext = true;
						}						
						if (intersect.object.parent.children[1]?.name === 'prevReportConfidenceTableBtn'){
							isPrev = true;
						}
					}
				}
				if (stepSimType === 'report-diagram'){
					if (intersect.object.name == "MeshUI-Frame"){
						if (intersect.object.parent.children[1]?.name === 'nextReportDiagramBtn'){
							isNext = true;
						}						
						if (intersect.object.parent.children[1]?.name === 'prevReportDiagramBtn'){
							isPrev = true;
						}
					}
				}
			}
		});
		if (isNext){
			simulationStep++;
			showCurrentSimulationStep();
		}
		if (isPrev){
			simulationStep--;
			showCurrentSimulationStep();
		}

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

	  //set state = normal
	  scene.getObjectByName('PopupBodyBlock').setState('normal');
	  objectsParams.interactiveObjectList.forEach(el => {
		if (el.objName !== selectedPutOnObjects)
			scene.getObjectByName('Popup' + el.objName + 'Block').setState('normal');
	  });
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
				if (intersect.object.name.includes('Collider')){
					const objName = intersect.object.name.replace('Collider', '');
					scene.getObjectByName('Popup' + objName + 'Block').setState('selected');
				}
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

function changeAllInfoPopupsVisibility(val){
	objectsParams.interactiveObjectList.forEach((item) => {
		scene.getObjectByName('Popup' + item.objName).visible = val;
	})
	scene.getObjectByName('PopupBody').visible = val;
}

function showCurrentSimulationStep(){
	scene.getObjectByName(IntroObjects.IntroContainerName).visible = false;
	scene.getObjectByName(QuizzObjects.QuizzContainerName).visible = false;
	scene.getObjectByName(TFQuizzObjects.QuizzContainerName).visible = false;
	scene.getObjectByName(correctIncorrectObjects.containerName).visible = false;
	scene.getObjectByName(successObjects.containerName).visible = false;
	scene.getObjectByName(infoObjectsMediumTextImg.containerName).visible = false;
	scene.getObjectByName(infoObjectsMediumTextLargeImg.containerName).visible = false;
	scene.getObjectByName(infoObjectsMediumText.containerName).visible = false;
	scene.getObjectByName(infoObjectsSmall.containerName).visible = false;
	scene.getObjectByName('ReportFirstWindow').visible = false;
	scene.getObjectByName('ReportFirstTableWindow').visible = false;
	scene.getObjectByName('ReportConfidenceTableWindow').visible = false;
	scene.getObjectByName('ReportDiagramWindow').visible = false;

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
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'info-md-text-lg-img'){
		//intro container
		scene.getObjectByName(infoObjectsMediumTextLargeImg.containerName).visible = true;
		//title
		infoObjectsMediumTextLargeImg.titleTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].title});
		//content text
		infoObjectsMediumTextLargeImg.contentTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].content});
		//img
		const loader = new THREE.TextureLoader();  
		loader.load(PPE_DATA.vrSim.sim[simulationStep].img, function (texture) {
			//texture.minFilter = THREE.LinearFilter;
			infoObjectsMediumTextLargeImg.imgContainerObjName.set({ backgroundTexture: texture });
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
		//lrs
		if (PPE_DATA.vrSim.sim[simulationStep].correctAnswer.includes(1))
			lrsData.quizzData.questionText = PPE_DATA.vrSim.sim[simulationStep].btnText1;
		if (PPE_DATA.vrSim.sim[simulationStep].correctAnswer.includes(2))
			lrsData.quizzData.questionText = PPE_DATA.vrSim.sim[simulationStep].btnText2;
		if (PPE_DATA.vrSim.sim[simulationStep].correctAnswer.includes(3))
			lrsData.quizzData.questionText = PPE_DATA.vrSim.sim[simulationStep].btnText3;
		if (PPE_DATA.vrSim.sim[simulationStep].correctAnswer.includes(4))
			lrsData.quizzData.questionText = PPE_DATA.vrSim.sim[simulationStep].btnText4;
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'tf-quizz'){
		//question
		TFQuizzObjects.questionTextObj.set({content: PPE_DATA.vrSim.sim[simulationStep].question});
		//btns
		TFQuizzObjects.btnTextObj[0].set({content: PPE_DATA.vrSim.sim[simulationStep].btnText1});
		TFQuizzObjects.btnTextObj[1].set({content: PPE_DATA.vrSim.sim[simulationStep].btnText2});
		//correct`s
		TFQuizzObjects.correctQuizzBtnName = PPE_DATA.vrSim.sim[simulationStep].correctAnswer;

		scene.getObjectByName(TFQuizzObjects.QuizzContainerName).visible = true;
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'put-on'){
		PPE_DATA.vrSim.sim[simulationStep].glowObjectsName.forEach(element => {
			scene.getObjectByName('Popup' + element).visible = true;
		})
		putOnObjects.correctObjectName = PPE_DATA.vrSim.sim[simulationStep].correctOnjectName;
		lrsData.quizzData.questionText = 'Put on ' + putOnObjects.correctObjectName + '?';
		putOnObjects.interactiveObject = PPE_DATA.vrSim.sim[simulationStep].interactiveObjectsName;
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'sim-end'){
		removeDecalsFromScene(scene);
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
			//wins
			const pos = new THREE.Vector3(-2.0, 2.16, -2.0);
			const rotY = 0.5;
			['infoGroupSmall', 'quizz-window', 'correctGroup', 'ConfidenceWindow', 'infoGroupMediumTextImg', 'infoGroupMediumTextLargeImg'].forEach((el) => {
				scene.getObjectByName(el).position.copy(pos);
				scene.getObjectByName(el).rotation.y = rotY;
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
			//wins
			const pos = new THREE.Vector3(0.0, 2.16, -3.4);
			const rotY = 0.0;
			['infoGroupSmall', 'quizz-window', 'correctGroup', 'ConfidenceWindow', 'infoGroupMediumTextImg', 'infoGroupMediumTextLargeImg'].forEach((el) => {
				scene.getObjectByName(el).position.copy(pos);
				scene.getObjectByName(el).rotation.y = rotY;
			})
			roomNum = 1;
		}
		
		simulationStep++;
		showCurrentSimulationStep();
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'create-polution-decals'){
		addPolutionDecals(scene);
		simulationStep++;
		showCurrentSimulationStep();
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'polution-decals'){
		objectsParams.decals.forEach(i => {
			scene.getObjectByName(i.decalName).visible = 
				PPE_DATA.vrSim.sim[simulationStep].visibleDecals.some(el => el == i.decalName);
		})
		simulationStep++;
		showCurrentSimulationStep();
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'report-first'){
		scene.getObjectByName('ReportFirstWindow').visible = true;
		reportUI.introText.set({content: document.getElementById('reportFrame').contentWindow.document.getElementById('simreportheader').textContent});
		reportUI.correctTitle.set({content: document.getElementById('reportFrame').contentWindow.document.getElementById('reportsimname').textContent});
		
		var table = document.getElementById('reportFrame').contentWindow.document.querySelectorAll('#main_table tr');
		for(let i = 0; i < 6; i++){
			reportUI.firstWinTableData[i].firstText.set({content: table[i].getElementsByClassName('questionreporttext')[0].textContent});
			reportUI.firstWinTableData[i].secondText.set({content: table[i].getElementsByClassName('answerreporttext')[0].textContent});
			const loader = new THREE.TextureLoader();  
			const src = table[i].querySelector('img').getAttribute('src');
			const prefix = src.includes('incorrect') ? 'in' : '';
			loader.load(`./assets/img/${prefix}correct.png`, function (texture) {
				reportUI.firstWinTableData[i].img.set({ backgroundTexture: texture });
				reportUI.firstWinTableData[i].img.visible = true;
			});
		}
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'report-first-table'){
		scene.getObjectByName('ReportFirstTableWindow').visible = true;
		var table = document.getElementById('reportFrame').contentWindow.document.querySelectorAll('#main_table tr');
		for(let i = 0; i < 8; i++){
			reportUI.secondWinTableData[i].img.visible = false;
			reportUI.secondWinTableData[i].firstText.set({content: ''});
			reportUI.secondWinTableData[i].secondText.set({content: ''});

			const 	from = PPE_DATA.vrSim.sim[simulationStep].from,
				 	to = PPE_DATA.vrSim.sim[simulationStep].to;
			if (i + from < to ){
				const index = i + from - 1;
				if (index >= table.length) return;
				reportUI.secondWinTableData[i].firstText.set({content: fixTextFotMeshUI(table[index].getElementsByClassName('questionreporttext')[0].textContent)});
				reportUI.secondWinTableData[i].secondText.set({content: fixTextFotMeshUI(table[index].getElementsByClassName('answerreporttext')[0].textContent)});
				const loader = new THREE.TextureLoader();  
				const src = table[index].querySelector('img').getAttribute('src');
				const prefix = src.includes('incorrect') ? 'in' : '';
				loader.load(`./assets/img/${prefix}correct.png`, function (texture) {
					reportUI.secondWinTableData[i].img.set({ backgroundTexture: texture });
					reportUI.secondWinTableData[i].img.visible = true;
				});
			}
		}
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'report-confidence-table'){
		scene.getObjectByName('ReportConfidenceTableWindow').visible = true;
		var table = document.getElementById('reportFrame').contentWindow.document.querySelectorAll('#DonningandDoffingPPE_ConfidenceTable tr');
		reportUI.confidenceTitle.set({content: document.getElementById('reportFrame').contentWindow.document.getElementById('DonningandDoffingPPE_ConfidenceLevel').textContent});
		
		const headerArr = table[0].querySelectorAll('th');
		reportUI.confidenceTableData[0].question.set({content: headerArr[0].textContent});
		reportUI.confidenceTableData[0].time.set({content: headerArr[1].textContent});
		reportUI.confidenceTableData[0].confidence.set({content: headerArr[2].textContent});
		reportUI.confidenceTableData[0].rezult.set({content: headerArr[3].textContent});

		const 	from = PPE_DATA.vrSim.sim[simulationStep].from,
				to = PPE_DATA.vrSim.sim[simulationStep].to;
		for(let i = 1; i < reportUI.confidencePerPage; i++){
			reportUI.confidenceTableData[i].rezult.visible = false;
			reportUI.confidenceTableData[i].question.set({content: ''});
			reportUI.confidenceTableData[i].time.set({content: ''});
			reportUI.confidenceTableData[i].confidence.set({content: ''});

			if (i + from < to ){
				const index = i + from - 1;
				if (index >= table.length) return;

				const cellsArr = table[index].querySelectorAll('td');
				reportUI.confidenceTableData[i].question.set({content: fixTextFotMeshUI(cellsArr[0].textContent)});
				reportUI.confidenceTableData[i].time.set({content: fixTextFotMeshUI(cellsArr[1].textContent)});
				reportUI.confidenceTableData[i].confidence.set({content: fixTextFotMeshUI(cellsArr[2].textContent)});
				
				const loader = new THREE.TextureLoader();  
				const src = cellsArr[3].querySelector('img')?.getAttribute('src');
				if (src){
					const prefix = src.includes('incorrect') ? 'in' : '';
					loader.load(`./assets/img/${prefix}correct.png`, function (texture) {
						reportUI.confidenceTableData[i].rezult.set({ backgroundTexture: texture });
						reportUI.confidenceTableData[i].rezult.visible = true;
					});
				}
			}
		}
	}
	if (PPE_DATA.vrSim.sim[simulationStep].type === 'report-diagram'){
		scene.getObjectByName('ReportDiagramWindow').visible = true;
	}
}

function fixTextFotMeshUI(text){
	return text.replaceAll('>', '');
}

export default App;