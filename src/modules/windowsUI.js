import * as THREE from 'three';
import ThreeMeshUI from "three-mesh-ui";

let hoverObjectsList = [];  
let IntroObjects = { 
	"IntroContainerName": "introGroup",
	"titleTextObj": null,
	"contentTextObj": null,
	"mediaContainerObjName": "introHero",
	"prevBtnObjName": "prevBtn",
	"nextBtnObjName": "nextBtn",
};
let QuizzObjects = { 
	"QuizzContainerName": "quizz-window",
	"titleTextObj": null,
	"btnTextObj": [null, null, null, null],
	"correctHighlightedObjName": null,
	"correctQuizzBtnName": null
};
let TFQuizzObjects = { 
	"QuizzContainerName": "tf-quizz-window",
	"questionTextObj": null,
	"btnTextObj": [null, null],
	"correctQuizzBtnName": null
};
let correctIncorrectObjects = {
	"containerName": "correctGroup",
	"titleTextObj": null,
	"contentTextObj": null
}
let infoObjectsMediumText = {
	"containerName": "infoGroupMediumText",
	"titleTextObj": null,
	"contentTextObj": null
};
let infoObjectsMediumTextImg = {
	"containerName": "infoGroupMediumTextImg",
	"titleTextObj": null,
	"contentTextObj": null,
	"imgContainerObjName": "imageInfoMd",
};
let infoObjectsMediumTextLargeImg = {
	"containerName": "infoGroupMediumTextLargeImg",
	"titleTextObj": null,
	"contentTextObj": null,
	"imgContainerObjName": "imageInfoLg",
};
let infoObjectsSmall = {
	"containerName": "infoGroupSmall",
	"titleTextObj": null,
	"contentTextObj": null,
};
let successObjects = {
	"containerName": "successPopup",
	"titleTextObj": null,
	"contentTextObj": null
}

function createSuccessPopup(scene){
	let popupGroup = new THREE.Group();
	popupGroup.name = successObjects.containerName;

	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 2.6,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};
	
	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 1.0,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	successObjects.titleTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(successObjects.titleTextObj);
	successObjects.contentTextObj = new ThreeMeshUI.Text({
		content: "Congratulations, you have completed the VR PPE Demo. Click OK to restart.",
		fontColor: params.darkColor,
	  	fontSize: params.titleFontSize,
	});
	contentBlock.add(successObjects.contentTextObj);

	const btnBlock = new ThreeMeshUI.Block({
		height: 0.2,
		width: 1.2,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
		borderRadius: 0.03,
		margin: 0.6
	}); 
	const btnText = new ThreeMeshUI.Text({
		content: "Ok",
		fontColor: params.lightColor,
		fontSize: params.textFontSize,
	}); 
	btnText.name = `successOk`; 
	btnBlock.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	btnBlock.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	btnBlock.add(btnText);
	hoverObjectsList.push({
		name: `successOk`,
		state: 'normal'
	})
	contentBlock.add(btnBlock);

	popupGroup.add(container)
	popupGroup.position.set(0.0, 2.6, -3.0);
	popupGroup.visible = false;

	scene.add(popupGroup); 
}

function createIntroPopup(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 5.0,
		titleFontSize: 0.125,
		textFontSize: 0.125,
	}
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};

	let popupGroup = new THREE.Group();
	popupGroup.name = IntroObjects.IntroContainerName;

	const textureLoader = new THREE.TextureLoader();  
	const infoGeometry = new THREE.BoxGeometry(60, 32, 0.01);
	const infoMaterial = new THREE.MeshBasicMaterial( { 
		transparent: true,
		map: textureLoader.load('./assets/img/introPopup-6.png', function (texture) {
			texture.minFilter = THREE.LinearFilter;
		}),
	} );
	
	let info = new THREE.Mesh(infoGeometry, infoMaterial);
	info.position.set(0.0, 0.04, 0.01);
	info.scale.set(0.0832, 0.095, 0.08);
	info.name = IntroObjects.mediaContainerObjName;
	info.visible = false;
	popupGroup.add(info);

	const container = new ThreeMeshUI.Block({
		//height: 3.0,
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	  });  
	const contentBlock = new ThreeMeshUI.Block({
		height: 3.0,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	  });  
	container.add(titleBlock, contentBlock);
	IntroObjects.titleTextObj = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	IntroObjects.contentTextObj = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
	titleBlock.add(IntroObjects.titleTextObj);
	contentBlock.add(IntroObjects.contentTextObj);
	//btns
	const btnsContainer = new ThreeMeshUI.Block({
		height: 0.4,
		width: params.width,
		justifyContent: 'end',
		alignContent: 'center',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});

	const prevBtnBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.6,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
	}); 
	const PrevText = new ThreeMeshUI.Text({
		content: "Back",
		fontColor: params.lightColor,
	  	fontSize: params.textFontSize,
	}); 
	PrevText.name = "prevBtn"; 
	prevBtnBlock.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	prevBtnBlock.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	prevBtnBlock.add(PrevText);
	hoverObjectsList.push({
		name: "prevBtn",
		state: 'normal'
	})

	const nextBtnBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.6,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
		margin: 0.1
	});  
	const NextText = new ThreeMeshUI.Text({
		content: "Next",
		fontColor: params.lightColor,
	  	fontSize: params.textFontSize,
	});
	NextText.name = "nextBtn"; 
	nextBtnBlock.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	nextBtnBlock.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	nextBtnBlock.add(NextText);
	hoverObjectsList.push({
		name: "nextBtn",
		state: 'normal'
	})
	
	btnsContainer.add(prevBtnBlock, nextBtnBlock);
	container.add(btnsContainer);

	popupGroup.position.set(0.0, 2.16, -3.5);
	popupGroup.add(container);
	popupGroup.visible = false;
	scene.add(popupGroup);
}

function createInfoSmall(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 3.5,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}; 
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};
	
	let popupGroup = new THREE.Group();
	popupGroup.name = infoObjectsSmall.containerName;

	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 0.7,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	infoObjectsSmall.titleTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(infoObjectsSmall.titleTextObj);
	infoObjectsSmall.contentTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.darkColor,
	  	fontSize: params.titleFontSize,
	});
	contentBlock.add(infoObjectsSmall.contentTextObj);

	//btns
	const btnContainer = new ThreeMeshUI.Block({
		height: 0.4,
		width: params.width,
		justifyContent: 'center',
		alignContent: 'center',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});

	const btnBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.6,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
	}); 
	const btnText = new ThreeMeshUI.Text({
		content: "OK",
		fontColor: params.lightColor,
	  	fontSize: params.textFontSize,
	}); 
	btnText.name = "okBtnInfoSmall"; 
	btnBlock.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	btnBlock.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	btnBlock.add(btnText);
	btnContainer.add(btnBlock);
	hoverObjectsList.push({
		name: "okBtnInfoSmall",
		state: 'normal'
	})

	container.add(btnContainer);

	popupGroup.add(container)
	popupGroup.position.set(0.0, 2.6, -3.5);
	popupGroup.visible = false;
	
	scene.add(popupGroup);
}

function createInfoMediumText(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 4.0,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}; 
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};
	
	let popupGroup = new THREE.Group();
	popupGroup.name = infoObjectsMediumText.containerName;

	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 2.5,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	infoObjectsMediumText.titleTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(infoObjectsMediumText.titleTextObj);
	infoObjectsMediumText.contentTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.darkColor,
	  	fontSize: params.titleFontSize,
	});
	contentBlock.add(infoObjectsMediumText.contentTextObj);

	//btns
	const btnContainer = new ThreeMeshUI.Block({
		height: 0.4,
		width: params.width,
		justifyContent: 'center',
		alignContent: 'center',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});

	const btnBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.6,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
	}); 
	const btnText = new ThreeMeshUI.Text({
		content: "OK",
		fontColor: params.lightColor,
	  	fontSize: params.textFontSize,
	}); 
	btnText.name = "okBtnInfoMediumText"; 
	btnBlock.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	btnBlock.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	btnBlock.add(btnText);
	btnContainer.add(btnBlock);
	hoverObjectsList.push({
		name: "okBtnInfoMediumText",
		state: 'normal'
	})

	container.add(btnContainer);

	popupGroup.add(container)
	popupGroup.position.set(0.0, 2.0, -3.5);
	popupGroup.visible = false;
	
	scene.add(popupGroup);
}

function createInfoMediumTextImg(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 5.0,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}; 
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};
	
	let popupGroup = new THREE.Group();
	popupGroup.name = infoObjectsMediumTextImg.containerName;

	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 1.5,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	infoObjectsMediumTextImg.titleTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(infoObjectsMediumTextImg.titleTextObj);
	infoObjectsMediumTextImg.contentTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.darkColor,
	  	fontSize: params.titleFontSize,
	});
	contentBlock.add(infoObjectsMediumTextImg.contentTextObj);

	infoObjectsMediumTextImg.imgContainerObjName = new ThreeMeshUI.Block({
		height: 1.5,
		width: 1.5,
		alignContent: "center",
		justifyContent: "start",
		padding: 0.1,
		backgroundSize: "contain"
	});
	container.add(infoObjectsMediumTextImg.imgContainerObjName);

	//btns
	const btnContainer = new ThreeMeshUI.Block({
		height: 0.4,
		width: params.width,
		justifyContent: 'center',
		alignContent: 'center',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});

	const btnBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.6,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
	}); 
	const btnText = new ThreeMeshUI.Text({
		content: "OK",
		fontColor: params.lightColor,
	  	fontSize: params.textFontSize,
	}); 
	btnText.name = "okBtnInfoMediumTextImg"; 
	btnBlock.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	btnBlock.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	btnBlock.add(btnText);
	btnContainer.add(btnBlock);
	hoverObjectsList.push({
		name: "okBtnInfoMediumTextImg",
		state: 'normal'
	})

	container.add(btnContainer);

	popupGroup.add(container)
	popupGroup.position.set(0.0, 2.0, -3.5);
	popupGroup.visible = false;
	
	scene.add(popupGroup);
}
function createInfoMediumTextLargeImg(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 5.0,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}; 
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};
	
	let popupGroup = new THREE.Group();
	popupGroup.name = infoObjectsMediumTextLargeImg.containerName;

	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 0.75,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	infoObjectsMediumTextLargeImg.titleTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(infoObjectsMediumTextLargeImg.titleTextObj);
	infoObjectsMediumTextLargeImg.contentTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.darkColor,
	  	fontSize: params.titleFontSize,
	});
	contentBlock.add(infoObjectsMediumTextLargeImg.contentTextObj);

	infoObjectsMediumTextLargeImg.imgContainerObjName = new ThreeMeshUI.Block({
		height: 2.25,
		width: 2.25,
		alignContent: "center",
		justifyContent: "start",
		padding: 0.1,
		backgroundSize: "contain"
	});
	container.add(infoObjectsMediumTextLargeImg.imgContainerObjName);

	//btns
	const btnContainer = new ThreeMeshUI.Block({
		height: 0.4,
		width: params.width,
		justifyContent: 'center',
		alignContent: 'center',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});

	const btnBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.6,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
	}); 
	const btnText = new ThreeMeshUI.Text({
		content: "OK",
		fontColor: params.lightColor,
	  	fontSize: params.textFontSize,
	}); 
	btnText.name = "okBtnInfoMediumTextLargeImg"; 
	btnBlock.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	btnBlock.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	btnBlock.add(btnText);
	btnContainer.add(btnBlock);
	hoverObjectsList.push({
		name: "okBtnInfoMediumTextLargeImg",
		state: 'normal'
	})

	container.add(btnContainer);

	popupGroup.add(container)
	popupGroup.position.set(0.0, 2.0, -3.5);
	popupGroup.visible = false;
	
	scene.add(popupGroup);
}

function createCorrectIncorrectPopup(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 3.0,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}
	
	let popupGroup = new THREE.Group();
	popupGroup.name = correctIncorrectObjects.containerName;

	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 0.5,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	correctIncorrectObjects.titleTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(correctIncorrectObjects.titleTextObj);
	correctIncorrectObjects.contentTextObj = new ThreeMeshUI.Text({
		content: "Correct/Incorrect",
		fontColor: params.darkColor,
	  	fontSize: params.titleFontSize,
	});
	contentBlock.add(correctIncorrectObjects.contentTextObj);

	popupGroup.add(container)
	popupGroup.position.set(0.0, 2.6, -3.0);
	popupGroup.visible = false;
	
	scene.add(popupGroup);
}

function createQuizzWindow(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 3.0,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};

	let popupGroup = new THREE.Group();
	popupGroup.name = QuizzObjects.QuizzContainerName;

	const container = new ThreeMeshUI.Block({
		//height: 3.0,
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 2.5,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	QuizzObjects.titleTextObj = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(QuizzObjects.titleTextObj);

	['1','2','3','4'].forEach((i) => {
		const btnBlock = new ThreeMeshUI.Block({
			height: 0.4,
			width: 2.7,
			alignContent: "center",
			justifyContent: "center",
			backgroundColor: params.darkColor,
			borderRadius: 0.03,
			margin: 0.05
		}); 
		QuizzObjects.btnTextObj[i-1] = new ThreeMeshUI.Text({
			content: "",
			fontColor: params.lightColor,
			fontSize: params.textFontSize,
		}); 
		QuizzObjects.btnTextObj[i-1].name = `quizz-btn-${i}`; 
		btnBlock.setupState({
			state: "selected",
			attributes: selectedAttributes
		});
		btnBlock.setupState({
			state: "normal",
			attributes: normalAttributes
		});
		btnBlock.add(QuizzObjects.btnTextObj[i-1]);
		hoverObjectsList.push({
			name: `quizz-btn-${i}`,
			state: 'normal'
		})
		contentBlock.add(btnBlock);
	})

	popupGroup.add(container);
	popupGroup.position.set(0.0, 2.16, -3.0);
	popupGroup.visible = false;
	scene.add(popupGroup);
}

function createTrueFalseQuizzWindow(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 3.0,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};

	let popupGroup = new THREE.Group();
	popupGroup.name = TFQuizzObjects.QuizzContainerName;

	const container = new ThreeMeshUI.Block({
		//height: 3.0,
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 1.75,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	const title = new ThreeMeshUI.Text({
		content: "Assessment",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(title);

	const questionBlock = new ThreeMeshUI.Block({
		height: 0.4,
		width: 2.7,
		alignContent: "left",
		justifyContent: "center",
		backgroundColor: params.lightColor,
		borderRadius: 0.03,
		margin: 0.05
	}); 
	TFQuizzObjects.questionTextObj = new ThreeMeshUI.Text({
		content: "Question ?",
		fontColor: params.darkColor,
	  	fontSize: params.titleFontSize,
	});
	questionBlock.add(TFQuizzObjects.questionTextObj)

	contentBlock.add(questionBlock);

	['1','2'].forEach((i) => {
		const btnBlock = new ThreeMeshUI.Block({
			height: 0.4,
			width: 2.7,
			alignContent: "center",
			justifyContent: "center",
			backgroundColor: params.darkColor,
			borderRadius: 0.03,
			margin: 0.05
		}); 
		TFQuizzObjects.btnTextObj[i-1] = new ThreeMeshUI.Text({
			content: "",
			fontColor: params.lightColor,
			fontSize: params.textFontSize,
		}); 
		TFQuizzObjects.btnTextObj[i-1].name = `tf-quizz-btn-${i}`; 
		btnBlock.setupState({
			state: "selected",
			attributes: selectedAttributes
		});
		btnBlock.setupState({
			state: "normal",
			attributes: normalAttributes
		});
		btnBlock.add(TFQuizzObjects.btnTextObj[i-1]);
		hoverObjectsList.push({
			name: `tf-quizz-btn-${i}`,
			state: 'normal'
		})
		contentBlock.add(btnBlock);
	})

	popupGroup.add(container);
	popupGroup.position.set(0.0, 2.16, -3.0);
	popupGroup.visible = false;
	scene.add(popupGroup);
}

function createInfoPopup(scene, name, position, tooltipText, xScale = 1.0){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x777777),
		width: 0.6,
		textFontSize: 0.1,
	}; 
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0xe4e73d ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};
	
	let popupGroup = new THREE.Group();
	popupGroup.name = 'Popup' + name;

	const container = new ThreeMeshUI.Block({
		width: params.width * xScale,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.darkColor,
		backgroundOpacity: 0.6,
		borderRadius: 0.05,
	});
	const contentBlock = new ThreeMeshUI.Block({
		height: 0.2,
		width: params.width * xScale,
		alignContent: "center",
		justifyContent: "start",
		padding: 0.05,
		borderRadius: 0.05,
		backgroundColor: params.darkColor,
		backgroundOpacity: 0.6,
	});  
	container.add(contentBlock);
	const text = new ThreeMeshUI.Text({
		content: tooltipText,
		fontColor: new THREE.Color(0xffffff),
	  	fontSize: params.textFontSize,
	});
	contentBlock.add(text);
	contentBlock.name = 'Popup' + name + 'Block';

	contentBlock.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	contentBlock.setupState({
		state: "normal",
		attributes: normalAttributes
	});

	popupGroup.add(container)
	popupGroup.position.copy(position);
	popupGroup.visible = false;
	
	scene.add(popupGroup);
}

function createConfidenceWindow(scene){
	const params = {
		fontFamily: "./assets/Roboto-msdf.json",
	  	fontTexture: "./assets/Roboto-msdf.png",
		darkColor: new THREE.Color(0x3e3e3e),
		lightColor: new THREE.Color(0xe2e2e2),
		width: 3.0,
		titleFontSize: 0.125,
		textFontSize: 0.1,
	}; 
	const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};
	
	let popupGroup = new THREE.Group();
	popupGroup.name = 'ConfidenceWindow';

	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});
	const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});  
	const contentBlock = new ThreeMeshUI.Block({
		height: 0.4,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(titleBlock, contentBlock);
	const titleTextObj = new ThreeMeshUI.Text({
		content: "Info",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});
	titleBlock.add(titleTextObj);
	const textObj = new ThreeMeshUI.Text({
		content: "How confidence is your answer?",
		fontColor: params.darkColor,
	  	fontSize: params.titleFontSize,
	});
	contentBlock.add(textObj);

	const imagesContainer = new ThreeMeshUI.Block({
		height: 0.6,
		width: 3.0,
		justifyContent: "start",
		padding: 0.0,
		contentDirection: 'row',
		backgroundColor: params.lightColor
	});
	const image1 = new ThreeMeshUI.Block({
		height: 0.6,
		width: 0.6,
		margin: 0.5
	});
	const image2 = new ThreeMeshUI.Block({
		height: 0.6,
		width: 0.6,
		margin: 0.25
	});
	imagesContainer.add(image1, image2);
	container.add(imagesContainer);

	let loader = new THREE.TextureLoader();  
	loader.load('./assets/img/dislike.png', function (texture) {
		//texture.minFilter = THREE.LinearFilter;
		image1.set({ backgroundTexture: texture });
	});

	loader = new THREE.TextureLoader();  
	loader.load('./assets/img/like.png', function (texture) {
		//texture.minFilter = THREE.LinearFilter;
		image2.set({ backgroundTexture: texture });
	});

	//btns
	const btnContainer = new ThreeMeshUI.Block({
		height: 0.4,
		width: params.width,
		justifyContent: 'start',
		alignContent: 'center',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});

	const btnBlockLow = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.75,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
		margin: 0.5
	}); 
	const btnTextLow = new ThreeMeshUI.Text({
		content: "Low",
		fontColor: params.lightColor,
	  	fontSize: params.textFontSize,
	}); 
	btnTextLow.name = "LowConfidenceBtn"; 
	btnBlockLow.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	btnBlockLow.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	btnBlockLow.add(btnTextLow);
	btnContainer.add(btnBlockLow);
	hoverObjectsList.push({
		name: "LowConfidenceBtn",
		state: 'normal'
	})

	const btnBlockHigh = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.75,
		alignContent: "center",
		justifyContent: "center",
		backgroundColor: params.darkColor,
	}); 
	const btnTextHigh = new ThreeMeshUI.Text({
		content: "High",
		fontColor: params.lightColor,
	  	fontSize: params.textFontSize,
	}); 
	btnTextHigh.name = "HighConfidenceBtn"; 
	btnBlockHigh.setupState({
		state: "selected",
		attributes: selectedAttributes
	});
	btnBlockHigh.setupState({
		state: "normal",
		attributes: normalAttributes
	});
	btnBlockHigh.add(btnTextHigh);
	btnContainer.add(btnBlockHigh);
	hoverObjectsList.push({
		name: "HighConfidenceBtn",
		state: 'normal'
	})

	container.add(btnContainer);

	popupGroup.add(container)
	popupGroup.position.set(0.0, 2.5, -3.0);
	popupGroup.visible = false;
	
	scene.add(popupGroup);
}

export {
    hoverObjectsList,
    IntroObjects, QuizzObjects, TFQuizzObjects, correctIncorrectObjects, infoObjectsMediumText, infoObjectsMediumTextImg,
    infoObjectsSmall, successObjects, infoObjectsMediumTextLargeImg,
    createSuccessPopup, createIntroPopup, createInfoSmall, createInfoMediumText, createInfoMediumTextImg,
    createCorrectIncorrectPopup, createQuizzWindow, createInfoPopup, createConfidenceWindow,
	createTrueFalseQuizzWindow, createInfoMediumTextLargeImg
}