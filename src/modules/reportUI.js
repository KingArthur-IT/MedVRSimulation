import * as THREE from 'three';
import ThreeMeshUI from "three-mesh-ui";
import { hoverObjectsList } from './windowsUI.js'

const params = {
    fontFamily: "./assets/Roboto-msdf.json",
    fontTexture: "./assets/Roboto-msdf.png",
    darkColor: new THREE.Color(0x3e3e3e),
    lightColor: new THREE.Color(0xe2e2e2),
    width: 5.0,
    titleFontSize: 0.125,
    textFontSize: 0.125,
}

const reportUI = {
    introText: '',
    correctTitle: '',
    firstWinTableData: []
}

function createReportFirstWindow(scene){
	let popupGroup = new THREE.Group();
	popupGroup.name = 'ReportFirstWindow';

	const container = new ThreeMeshUI.Block({
		//height: 3.0,
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
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
	container.add(contentBlock);

    container.add(setTitle());
    container.add(setText('introText', 0.125));
    container.add(setText('correctTitle', 0.15));
    for(let i = 0; i < 5; i++){
        reportUI.firstWinTableData.push({img: '', firstText: '', secondText: ''});
        container.add(setCorrectTableRow(i))
    }
    container.add(setBackNextBtns())

	popupGroup.position.set(0.0, 3.78, -3.5);
	popupGroup.add(container);
	popupGroup.visible = false;
	scene.add(popupGroup);
}

function setTitle(){
    const titleBlock = new ThreeMeshUI.Block({
		height: 0.28,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.darkColor,
	});
    const titleText = new ThreeMeshUI.Text({
		content: "Debrief Report",
		fontColor: params.lightColor,
	  	fontSize: params.titleFontSize,
	});  
    titleBlock.add(titleText);
    return titleBlock;
}

function setText(field, fontSize){
    const textBlock = new ThreeMeshUI.Block({
		height: 0.4,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
        backgroundColor: params.lightColor
	});
    reportUI[field] = new ThreeMeshUI.Text({
		content: "text",
		fontColor: params.darkColor,
	  	fontSize: fontSize,
	}); 
    textBlock.add(reportUI[field] ) 
    return textBlock;
}

function setCorrectTableRow(i){
    const container = new ThreeMeshUI.Block({
		height: 0.5,
		width: params.width,
		justifyContent: 'start',
		alignContent: 'left',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
        padding: 0.1
	});
    reportUI.firstWinTableData[i].img = new ThreeMeshUI.Block({
		height: 0.3,
		width: 0.3
	});
    const textContent = new ThreeMeshUI.Block({
		height: 0.6,
		width: 4.5,
		alignContent: 'left',
		contentDirection: 'column',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
        padding: 0.05,
	});
    container.add(reportUI.firstWinTableData[i].img, textContent);

    const first = new ThreeMeshUI.Block({
		height: 0.15,
        width: 4.5,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
        backgroundColor: params.lightColor
	});
    reportUI.firstWinTableData[i].firstText = new ThreeMeshUI.Text({
		content: "title",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    first.add(reportUI.firstWinTableData[i].firstText);
    
    const second = new ThreeMeshUI.Block({
		height: 0.15,
        width: 4.0,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
        backgroundColor: params.lightColor
	});
    reportUI.firstWinTableData[i].secondText = new ThreeMeshUI.Text({
		content: "text",
		fontColor: new THREE.Color(0x29a8e0),
	  	fontSize: params.textFontSize,
	});
    second.add(reportUI.firstWinTableData[i].secondText);

    textContent.add(first, second);
    return container;
}

function setBackNextBtns(){
    const selectedAttributes = {
		backgroundColor: new THREE.Color( 0x777777 ),
		fontColor: new THREE.Color( 0x222222 )
	};
	const normalAttributes = {
		backgroundColor: params.darkColor,
		fontColor: params.lightColor
	};

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
	PrevText.name = "prevReportFirstBtn"; 
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
		name: "prevReportFirstBtn",
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
	NextText.name = "nextReportFirstBtn"; 
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
		name: "nextReportFirstBtn",
		state: 'normal'
	})
	
	btnsContainer.add(prevBtnBlock, nextBtnBlock);
	return btnsContainer;
}

export { createReportFirstWindow, reportUI }