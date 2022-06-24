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
    firstWinTableData: [],
	secondWinTableData: [],
	confidenceTitle: '',
	confidenceTableData: [],
	confidencePerPage: 7
}

function createReportFirstWindow(scene){
	let popupGroup = new THREE.Group();
	popupGroup.name = 'ReportFirstWindow';

	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	}); 
	const contentBlock = new ThreeMeshUI.Block({
		height: 3.2,
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
    for(let i = 0; i < 6; i++){
        reportUI.firstWinTableData.push({img: '', firstText: '', secondText: ''});
        container.add(setCorrectTableRow('firstWinTableData', i))
    }
    container.add(setBackNextBtns("prevReportFirstBtn", "nextReportFirstBtn", true))

	popupGroup.position.set(0.0, 3.78, -3.5);
	popupGroup.add(container);
	popupGroup.visible = false;
	scene.add(popupGroup);
}

function createReportFirstTableWindow(scene){
	let popupGroup = new THREE.Group();
	popupGroup.name = 'ReportFirstTableWindow';

	const container = new ThreeMeshUI.Block({
		//height: 3.0,
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	}); 
	const contentBlock = new ThreeMeshUI.Block({
		height: 3.3,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(contentBlock);

    container.add(setTitle());

    for(let i = 0; i < 8; i++){
        reportUI.secondWinTableData.push({img: '', firstText: '', secondText: ''});
        container.add(setCorrectTableRow('secondWinTableData', i))
    }
    container.add(setBackNextBtns("prevReportFirstTableBtn", "nextReportFirstTableBtn"));

	popupGroup.position.set(0.0, 3.78, -3.5);
	popupGroup.add(container);
	popupGroup.visible = false;
	scene.add(popupGroup);
}

function createReportConfidenceTableWindow(scene){
	let popupGroup = new THREE.Group();
	popupGroup.name = 'ReportConfidenceTableWindow';

	const container = new ThreeMeshUI.Block({
		width: params.width,
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
		justifyContent: "start",
	}); 
	const contentBlock = new ThreeMeshUI.Block({
		height: 3.3,
		width: params.width,
		alignContent: "left",
		justifyContent: "start",
		padding: 0.1,
		backgroundColor: params.lightColor,
		backgroundOpacity: 1,
	});  
	container.add(contentBlock);

    container.add(setTitle());
	container.add(setText('confidenceTitle', 0.125));


	reportUI.confidenceTableData.push({question: '', time: '', confidence: '', rezult: ''});
    container.add(setConfidenceTableHeader('confidenceTableData', 0))

    for(let i = 1; i < reportUI.confidencePerPage; i++){
        reportUI.confidenceTableData.push({question: '', time: '', confidence: '', rezult: ''});
        container.add(setConfidenceTableRow('confidenceTableData', i))
    }
    container.add(setBackNextBtns("prevReportConfidenceTableBtn", "nextReportConfidenceTableBtn"));

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

function setCorrectTableRow(field, i){
    const container = new ThreeMeshUI.Block({
		width: params.width,
		justifyContent: 'start',
		alignContent: 'left',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
        padding: 0.1
	});
    reportUI[field][i].img = new ThreeMeshUI.Block({
		height: 0.2,
		width: 0.2
	});
    const textContent = new ThreeMeshUI.Block({
		height: 0.25,
		width: 4.5,
		alignContent: 'left',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		padding: 0.1
	});
    container.add(reportUI[field][i].img, textContent);

    reportUI[field][i].firstText = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    textContent.add(reportUI[field][i].firstText);
    
    reportUI[field][i].secondText = new ThreeMeshUI.Text({
		content: "",
		fontColor: new THREE.Color(0x29a8e0),
	  	fontSize: params.textFontSize,
	});
    textContent.add(reportUI[field][i].secondText);

	reportUI[field][i].img.visible = false;
    return container;
}

function setConfidenceTableRow(field, i){
    const container = new ThreeMeshUI.Block({
		width: params.width,
		justifyContent: 'start',
		alignContent: 'left',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
        padding: 0.1
	});
	const questionBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 2.0,
		alignContent: 'left',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		padding: 0.1
	});
	const timeBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 1.0,
		alignContent: 'left',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		padding: 0.1
	});
	const confidenceBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 1.0,
		alignContent: 'left',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: params.lightColor,
		padding: 0.1
	});
    reportUI[field][i].rezult = new ThreeMeshUI.Block({
		height: 0.2,
		width: 0.2
	});
	container.add(questionBlock, timeBlock, confidenceBlock, reportUI[field][i].rezult);

    reportUI[field][i].question = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    questionBlock.add(reportUI[field][i].question);
	reportUI[field][i].time = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    timeBlock.add(reportUI[field][i].time);
	reportUI[field][i].confidence = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    confidenceBlock.add(reportUI[field][i].confidence);
    
	reportUI[field][i].rezult.visible = false;
    return container;
}

function setConfidenceTableHeader(field, i){
    const container = new ThreeMeshUI.Block({
		width: params.width,
		justifyContent: 'start',
		alignContent: 'left',
		contentDirection: 'row',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: new THREE.Color(0xbfc9de),
        padding: 0.1
	});
	const questionBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 2.0,
		alignContent: 'left',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: new THREE.Color(0xbfc9de),
		padding: 0.1,
	});
	const timeBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.8,
		alignContent: 'left',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: new THREE.Color(0xbfc9de),
		padding: 0.1
	});
	const confidenceBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 1.2,
		alignContent: 'left',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: new THREE.Color(0xbfc9de),
		padding: 0.1
	});
	const rezultBlock = new ThreeMeshUI.Block({
		height: 0.25,
		width: 0.8,
		alignContent: 'left',
		fontFamily: params.fontFamily,
	  	fontTexture: params.fontTexture,
		backgroundColor: new THREE.Color(0xbfc9de),
		padding: 0.1
	});
	container.add(questionBlock, timeBlock, confidenceBlock, rezultBlock);

    reportUI[field][i].question = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    questionBlock.add(reportUI[field][i].question);
	reportUI[field][i].time = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    timeBlock.add(reportUI[field][i].time);
	reportUI[field][i].confidence = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    confidenceBlock.add(reportUI[field][i].confidence);
	reportUI[field][i].rezult = new ThreeMeshUI.Text({
		content: "",
		fontColor: params.darkColor,
	  	fontSize: params.textFontSize,
	});
    rezultBlock.add(reportUI[field][i].rezult);
    
    return container;
}

function setBackNextBtns(prevBtnName, nextBtnName, isOnlyNext = false){
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

	if (!isOnlyNext){
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
		PrevText.name = prevBtnName; 
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
			name: prevBtnName,
			state: 'normal'
		});
		btnsContainer.add(prevBtnBlock);
	}

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
	NextText.name = nextBtnName; 
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
		name: nextBtnName,
		state: 'normal'
	})
	
	btnsContainer.add(nextBtnBlock);
	return btnsContainer;
}

export { createReportFirstWindow, reportUI, createReportFirstTableWindow, createReportConfidenceTableWindow }