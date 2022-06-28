import { Vector3, Euler } from 'three';

const objectsParams = {
	modelPath: './assets/models/',
	room: {
		fileName:           'rooms/ER_room_01.fbx',
		objName:            'Room',
		position:           new Vector3(-3.2, -1.5, 0.33),
		rotation:           new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
		scale: 	            new Vector3(0.065, 0.065, 0.065),
	},	
	body: {
		fileName:           		'body/physician',
		objName:            		'Body',
		tooltipText:				'Click the nurse to interact',
		tooltopXScale:				2.5,
		position:           		new Vector3(-2.4, -1.5, -0.3),
		rotation:           		new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),		
		scale: 	            		new Vector3(0.065, 0.065, 0.065),
		collisionGeometry: 			'Box',
		collisionPosition:  		new Vector3(0.72, 0.34, -5.0),
		collisionSize:      		new Vector3(1.1, 3.6, 1.0),
		popupPosition:           	new Vector3(0.68, 2.3, -3.5),

		secondRoomPosition: 		new Vector3(-5.0, -1.5, 3.0),
		secondRoomRotation: 		new Vector3(0.0, 0.75, 0.0),
		secondRoomСollisionPosition:new Vector3(-5.13, 0.34, -1.75),		
		secondRoomPopupPosition: 	new Vector3(-5.15, 2.3, -1.75),
		secondRoomPopupRotation: 	new Vector3(0.0, 0.75, 0.0)
	},	
	interactiveObjectList: [
		{
			id: 4,
			fileName:           'gown/table_gown',
			objName:            'Robe',
			tooltipText:		'Isolation gown',
			tooltopXScale:		1.5,
			position: 			new Vector3(-4.0, -1.11, -0.1),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			collisionGeometry: 'Box',
			collisionPosition: 	new Vector3(-2.36, 0.31, -3.0),
			collisionSize: 		new Vector3(0.6, 0.2, 0.5),
			popupPosition: 		new Vector3(-2.4, 0.6, -3.15)
		},
		{
			id: 5,
			fileName:           'mask/mask',
			objName:            'Mask',
			tooltipText:		'N95 Mask',
			tooltopXScale:		1.0,
			position: 			new Vector3(-5.52, -3.45, 0.95),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			collisionGeometry: 'Sphree',
			collisionPosition: 	new Vector3(-2.4, -0.19, -2.6),
			collisionSize: 		new Vector3(0.25, 16, 16),
			popupPosition: 		new Vector3(-2.1, 0.3, -2.3)
		},
		{
			id: 6,
			fileName:           'eye-protection/faceshield',
			objName:            'Glasses',
			tooltipText:		'Faceshield',
			tooltopXScale:		1.0,
			position: 			new Vector3(-4.65, -3.25, 1.07),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			collisionGeometry: 'Sphree',
			collisionPosition: 	new Vector3(-1.52, 0.12, -2.4),
			collisionSize: 		new Vector3(0.3, 16, 16),
			popupPosition: 		new Vector3(-1.45, 0.4, -2.5)
		},
		{
			id: 7,
			fileName:           'gloves/box',
			objName:            'Gloves',
			tooltipText:		'Glove Box',
			tooltopXScale:		1.25,
			position: 			new Vector3(-2.33, -1.0, -0.07),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			collisionGeometry: 'Box',
			collisionPosition: 	new Vector3(-1.43, 0.4, -2.9),
			collisionSize: 		new Vector3(0.65, 0.3, 0.2),
			popupPosition: 		new Vector3(-1.5, 0.6, -3.15)
		},
		{
			id: 8,
			fileName:           'rooms/glovebox_counter',
			objName:            'GlovesPatientRoom',
			tooltipText:		'Glove Box',
			tooltopXScale:		1.25,
			position: 			new Vector3(-3.2, -1.5, -0.07),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			collisionGeometry: 'Box',
			collisionPosition: 	new Vector3(-5.89, 0.25, -0.47),
			collisionSize: 		new Vector3(0.35, 0.3, 0.6),
			popupPosition: 		new Vector3(-6.0, 0.6, -0.47)
		},
	],
	clothesObjectList: [
		{
			id: 4,
			fileName:           'gown/gown',
			objName:            'BodyRobe',
			position: 			new Vector3(-4.0, -1.11, -0.1),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 5,
			fileName:           'mask/mask',
			objName:            'BodyMask',
			position: 			new Vector3(-5.52, -3.45, 0.95),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 6,
			fileName:           'eye-protection/faceshield',
			objName:            'BodyGlasses',
			position: 			new Vector3(-4.65, -3.25, 1.07),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 7,
			fileName:           'gloves/gloves',
			objName:            'BodyGloves',
			position: 			new Vector3(-2.33, -1.0, -0.07),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
	],
	firstRoomObjectList:[
		{
			id: 1,
			fileName: 			'rooms/ER_table',
			objName:			'Table',
			position: 			new Vector3(-3.1, -1.5, 0.35),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 2,
			fileName: 			'rooms/ER_trash_room1',
			objName:			'EmptyTrash',
			position: 			new Vector3(-2.7, -1.5, 0.28),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
	],
	secondRoomObjectList:[
		{
			id: 1,
			fileName:           'patientRoom/bed',
			objName:            'Bed',
			position: 			new Vector3(-3.0, -1.5, -1.48),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 2,
			fileName:           'patientRoom/patient',
			objName:            'Patient',
			position: 			new Vector3(-3.0, -1.5, -1.48),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 3,
			fileName:           'patientRoom/ER_wall_equipment',
			objName:            'WallEquipment',
			position: 			new Vector3(-3.0, -1.45, 0.3),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 4,
			fileName:           'patientRoom/ER_trash_room2',
			objName:            'FullTrash',
			position: 			new Vector3(-3.3, -1.45, 0.33),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
	],
	decals: [
		{
			objName:            'gown',
			decalName:          'decal-gown-1',
			position:           new Vector3(-5.22, 1.373, -1.423),
			orientation:        new Euler(0.0, 0.0, 0.0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'gown',
			decalName:          'decal-gown-2',
			position:           new Vector3(-4.838, 1.071, -1.603),
			orientation:        new Euler(0.0, 0.5, 0.0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'gown',
			decalName:          'decal-gown-3',
			position:           new Vector3(-5.12, 0.307, -1.404),
			orientation:        new Euler(0.0, 0.0, 0.0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'gown',
			decalName:          'decal-gown-4',
			position:           new Vector3(-4.813, -0.231, -1.731),
			orientation:        new Euler(0.0, 0.5, 0.0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'Glove_on_hands',
			decalName:          'decal-gloves',
			position:           new Vector3(-4.803, 0.347, -2.164),
			orientation:        new Euler(0.0, 0.0, 0.0),
			scale:              new Vector3(1.0, 1.0, 1.0)	
		},
		{
			objName:            'N95_mask',
			decalName:          'decal-mask',
			position:           new Vector3(-4.944, 1.783, -1.571),
			orientation:        new Euler(0.0, 0.0, 0.0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'FaceShield_glass001',
			decalName:          'decal-eye',
			position:           new Vector3(-5.057, 1.966, -1.503),
			orientation:        new Euler(2.0, 2.0, 2.0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
	],	
};

export { objectsParams }