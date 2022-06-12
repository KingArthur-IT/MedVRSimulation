import { Vector3, Euler } from 'three';

const objectsParams = {
	modelPath: './assets/models/',
	room: {
		fileName:           'rooms/Room.fbx',
		objName:            'Room',
		position:           new Vector3(-3.2, -1.5, 0.33),
		rotation:           new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
		scale: 	            new Vector3(0.065, 0.065, 0.065),
	},	
	body: {
		fileName:           'body/physician',
		objName:            'Body',
		position:           new Vector3(-2.4, -1.5, -1.3),
		glowPosition:       new Vector3(-2.65, -1.7, -4.29),
		rotation:           new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),		
		scale: 	            new Vector3(0.065, 0.065, 0.065),
		glowScale: 	        new Vector3(0.07, 0.07, 0.01),
		collisionGeometry: 'Box',
		collisionPosition:  new Vector3(0.72, 0.34, -5.0),
		collisionSize:      new Vector3(1.1, 3.6, 1.0),
	},	
	interactiveObjectList: [
		{
			id: 4,
			fileName:           'gown/table_gown',
			objName:            'Robe',
			position: 			new Vector3(-4.0, -1.11, -0.1),
			glowPosition: 		new Vector3(-5.21, -1.64, -4.86),
			droppedPosition: 	new Vector3(0.65, 1.73, -0.8),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			droppedRotation:    new Vector3(-1.35, 0, 1.74),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			glowScale: 	  		new Vector3(0.07, 0.067, 0.01),
			collisionGeometry: 'Box',
			collisionPosition: 	new Vector3(-2.36, 0.31, -3.0),
			collisionSize: 		new Vector3(0.6, 0.2, 0.5)
		},
		{
			id: 5,
			fileName:           'mask/mask',
			objName:            'Mask',
			position: 			new Vector3(-5.52, -3.45, 0.95),
			glowPosition: 		new Vector3(-1.63, -3.35, -0.81),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			glowScale: 	  		new Vector3(0.08, 0.07, 0.08),
			collisionGeometry: 'Sphree',
			collisionPosition: 	new Vector3(-2.4, -0.19, -2.6),
			collisionSize: 		new Vector3(0.25, 16, 16)
		},
		{
			id: 6,
			fileName:           'eye-protection/faceshield',
			objName:            'Glasses',
			position: 			new Vector3(-4.65, -3.25, 1.07),
			glowPosition: 		new Vector3(-0.58, -3.38, -4.41),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			glowScale: 	  		new Vector3(0.07, 0.067, 0.01),
			collisionGeometry: 'Sphree',
			collisionPosition: 	new Vector3(-1.52, 0.12, -2.4),
			collisionSize: 		new Vector3(0.3, 16, 16)
		},
		{
			id: 7,
			fileName:           'gloves/box',
			objName:            'Gloves',
			position: 			new Vector3(-2.33, -1.0, -0.07),
			glowPosition: 		new Vector3(-3.59, -0.4, -5.16),
			droppedPosition: 	new Vector3(-4.3, 1.1, -0.43),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			droppedRotation: 	new Vector3(-1.1, 0, 0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
			glowScale: 	  		new Vector3(0.065, 0.07, 0.01),
			collisionGeometry: 'Box',
			collisionPosition: 	new Vector3(-1.43, 0.4, -2.9),
			collisionSize: 		new Vector3(0.65, 0.3, 0.2)
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
	secondRoomObjectList:[
		{
			id: 1,
			fileName:           'patientRoom/bed',
			objName:            'Bed',
			position: 			new Vector3(0.5, -1.5, -1.3),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 2,
			fileName:           'patientRoom/patient',
			objName:            'Patient',
			position: 			new Vector3(0.5, -1.5, -1.3),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
		{
			id: 3,
			fileName:           'patientRoom/powerboard_wall_equipment',
			objName:            'WallEquipment',
			position: 			new Vector3(-1.72, -1.45, -8.0),
			rotation: 			new Vector3(Math.PI * 0.0, Math.PI * 0.0, Math.PI * 0.0),
			scale: 	  			new Vector3(0.065, 0.065, 0.065),
		},
	],
	decals: [
		{
			objName:            'gown',
			decalName:          'decal-gown-1',
			position:           new Vector3(0.57, 1.285, -4.6),
			orientation:        new Euler(0, 0, 0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'gown',
			decalName:          'decal-gown-2',
			position:           new Vector3(0.9, 0.92, -4.6),
			orientation:        new Euler(0, 0, 0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'gown',
			decalName:          'decal-gown-3',
			position:           new Vector3(0.57, 0.43, -4.58),
			orientation:        new Euler(0, 0, 0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'gown',
			decalName:          'decal-gown-4',
			position:           new Vector3(0.89, -0.23, -4.61),
			orientation:        new Euler(0, 0, 0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'Glove_on_hands',
			decalName:          'decal-gloves',
			position:           new Vector3(1.27, 0.36, -4.96),
			orientation:        new Euler(0, 0, 0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'N95_mask',
			decalName:          'decal-mask',
			position:           new Vector3(0.735, 1.75, -4.61),
			orientation:        new Euler(0, 0, 0),
			scale:              new Vector3(0.2, 0.2, 0.2)	
		},
		{
			objName:            'eye_protection',
			decalName:          'decal-eye',
			position:           new Vector3(0.664, 1.92, -4.635),
			orientation:        new Euler(0, 0, 0),
			scale:              new Vector3(0.1, 0.1, 0.1)	
		},
	],	
};

export { objectsParams }