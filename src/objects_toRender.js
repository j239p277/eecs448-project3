// filename    : objects_toRender.js
// description : Helper functions to keep main.js less cluttered
// last update : 10 25 2017
//
  let Puck, Player1, AI;
  let _color; // Used to load textures
  let S1, S2, S3, S4, S5, S6, S7, S8, Ground, /* Ground2, */ Top;
  let Light;
  let Camera1, Camera2, Camera3, Camera4, Camera5;
  // Player
  let player_height = 1;
  let player_diameter = 5.5;
  let player_yoff = player_height / 2;
  let player_polygons = 50;
  let player_speed = 0.33;
  let ai_speed = 0.33;
  let player_mass = 2800;
  let player_friction = 0.002;
  let player_restitution = 0;
  // Puck
  let puck_height = 0.3;
  let puck_diameter = 3.2;
  let puck_yoff = puck_height / 2;
  let puck_polygons = 50;
  let puck_mass = 3.22;
  let puck_friction = 0;
  let puck_restitution = 1;
  // Ground
  let ground_length = 80;
  let ground_restitution = 0;
  let ground_yoff = -0.5;
  // Walls
  let playarea_height = 25;
  let playarea_yoff = -0.5;
  let playarea_restitution = 0.7;
  let playarea_localOpacity = 1.0;
  // Goal
  let goal_height = 0.16; // ~Half puck_height
  let goal_width = ground_length / 3;
  // Scores
  let score_ai = 0;
  let score_red = 0;
//
// Used in scene creation

/**
 * Gives each shape and surface is appropriate size, color, position. Controls lighting and camera placement.
 * @param {scene} scene scene object containing all gameplay elements
 */

function loadGameObjects(scene) {
  let puck_skin = "puck"; // Now we can dynamically load textures to fit themes
  // This creates a light, aiming 0,1,0 - to the sky
  Light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  Light.intensity = 0.9;
  // This creates the play area
  Ground = BABYLON.Mesh.CreateBox("ground", 2 * goal_width + 0.1, scene);
  Ground.position.y = ground_yoff;
  Ground.scaling.z = 1.5;
  Ground.scaling.y = 0.01;
  loadMaterial(Ground, "ground", loadTextures, false, [0.7, 0.7, 0.7], scene);
  /* Not Final
  // This creates an infinite ground
  Ground2 = BABYLON.MeshBuilder.CreatePlane("ground2", playarea_height, scene);
  Ground2.rotation.x = Math.PI / 2;
  Ground2.position.y = ground_yoff;
  Ground2.scaling = new BABYLON.Vector3(800, 800, 1);
  Ground2.showBoundingBox = true;
  loadMaterial(Ground2, "ground2", false, false, [0.2, 0.2, 0.2], scene);
  */
  // This creates the top of the play area
  Top = BABYLON.Mesh.CreateBox("top", 2 * goal_width, scene);
  Top.position.y = playarea_height + ground_yoff;
  Top.scaling.z = 1.5;
  Top.scaling.y = 0.01;
  loadMaterial(Top, "top", false, false, [0.7, 0.7, 0.7], scene);
  Top.visibility = 0;
  // This creates the puck
  Puck = BABYLON.Mesh.CreateCylinder("puck", puck_height, puck_diameter, puck_diameter, puck_polygons, 1, scene);
  Puck.position = new BABYLON.Vector3(0, puck_yoff + 10, 0);
  // Set the puck material
  loadMaterial(Puck, puck_skin, loadTextures, false, [0.5, 1.0, 0.5], scene);
  // This creates the controlled object
  Player1 = BABYLON.Mesh.CreateCylinder("player1", player_height, player_diameter, player_diameter, player_polygons, 1, scene);
  Player1.position = new BABYLON.Vector3(0, player_yoff, (ground_length / 2) - player_diameter);
  // Set the player material
  loadMaterial(Player1, "playerOnLoad", loadTextures, false, [1.0, 1.0, 1.0], scene);
  // This creates the opposing player
  AI = BABYLON.Mesh.CreateCylinder("ai", player_height, player_diameter, player_diameter, player_polygons, 1, scene);
  AI.position = new BABYLON.Vector3(0, player_yoff, (-ground_length / 2) + player_diameter);
  // Set the AI material
  loadMaterial(AI, "ai", loadTextures, false, [0.4, 0.4, 0.4], scene);
  // This creates the boundaries of our play area but something is wrong
  // Appears as RIGHT bounded box
  S1 = BABYLON.MeshBuilder.CreatePlane("side1", playarea_height, scene);
  S1.scaling = new BABYLON.Vector3(ground_length, playarea_height, 1);
  S1.rotation.y = Math.PI / 2;
  S1.position.x = (-ground_length / 3);
  S1.position.y = playarea_yoff + (playarea_height / 2);
  // Use showPlayArea to view the boundaries
  if(showPlayArea) { S1.showBoundingBox = true; } else {
    loadMaterial(S1, "sides", loadTextures, loadTextures, [0, 0, 0], scene);
    // S1.material.alpha = 0.8;
  }
  // Appears as LEFT bounded box
  S2 = BABYLON.MeshBuilder.CreatePlane("side2", playarea_height, scene);
  S2.scaling = new BABYLON.Vector3(ground_length, playarea_height, 1);
  S2.rotation.y = Math.PI / 2;
  S2.position.x = ground_length / 3;
  S2.position.y = playarea_yoff + (playarea_height / 2);
  // Use showPlayArea to view the boundaries
  if(showPlayArea) { S2.showBoundingBox = true; } else {
    loadMaterial(S2, "sides", loadTextures, loadTextures, [1.0, 1.0, 1.0], scene);
    // S2.material.alpha = 0.8;
  }
  // Appears as BACK LEFT bounded box
  S3 = BABYLON.MeshBuilder.CreatePlane("side3", playarea_height, scene);
  S3.scaling = new BABYLON.Vector3(goal_width / 2,  playarea_height, 1);
  S3.position.x = goal_width / 2 + goal_width / 4;
  S3.position.z = (-ground_length / 2);
  S3.position.y = playarea_yoff + (playarea_height / 2);
  S3.rotation.y = Math.PI;
  // Use showPlayArea to view the boundaries
  if(showPlayArea) { S3.showBoundingBox = true; } else {
    loadMaterial(S3, "goalLeft", loadTextures, loadTextures, [1.0, 1.0, 1.0], scene);
  }
  // Appears as CLOSEST LEFT bounded box
  S4 = BABYLON.MeshBuilder.CreatePlane("side4", playarea_height, scene);
  S4.scaling = new BABYLON.Vector3(goal_width / 2,  playarea_height, 1);
  S4.position.x = goal_width / 2 + goal_width / 4;
  S4.position.z = ground_length / 2;
  S4.position.y = playarea_yoff + (playarea_height / 2);
  // Use showPlayArea to view the boundaries
  if(showPlayArea) { S4.showBoundingBox = true; } else {
    loadMaterial(S4, "goalLeft", loadTextures, loadTextures, [1.0, 1.0, 1.0], scene);
    S4.material.alpha = playarea_localOpacity;
  }
  // Appears as BACK CENTER bounded box
  S5 = BABYLON.MeshBuilder.CreatePlane("side5", playarea_height, scene);
  S5.scaling = new BABYLON.Vector3(goal_width, playarea_height, 1);
  S5.position.z = (-ground_length / 2);
  S5.position.y = (goal_height / 2) + (playarea_height / 2);
  S5.rotation.y = Math.PI;
  // Use showPlayArea to view the boundaries
  if(showPlayArea) { S5.showBoundingBox = true; } else {
    loadMaterial(S5, "goals", loadTextures, loadTextures, [0.5, 0.5, 0.5], scene);
  }
  // Appears as CLOSEST CENTER bounded box
  S6 = BABYLON.MeshBuilder.CreatePlane("side6", playarea_height, scene);
  S6.scaling = new BABYLON.Vector3(goal_width, playarea_height, 1);
  S6.position.z = ground_length / 2;
  S6.position.y = (goal_height / 2) + (playarea_height / 2);
  // Use showPlayArea to view the boundaries
  if(showPlayArea) { S6.showBoundingBox = true; } else {
    loadMaterial(S6, "goals", loadTextures, loadTextures, [1.0, 1.0, 1.0], scene);
    S6.material.alpha = playarea_localOpacity;
  }
  // Appears as BACK RIGHT bounded box
  S7 = BABYLON.MeshBuilder.CreatePlane("side7", playarea_height, scene);
  S7.scaling = new BABYLON.Vector3(goal_width / 2,  playarea_height, 1);
  S7.position.x = -(goal_width / 2 + goal_width / 4);
  S7.position.z = (-ground_length / 2);
  S7.position.y = playarea_yoff + (playarea_height / 2);
  S7.rotation.y = Math.PI;
  // Use showPlayArea to view the boundaries
  if(showPlayArea) { S7.showBoundingBox = true; } else {
    loadMaterial(S7, "goalRight", loadTextures, loadTextures, [1.0, 1.0, 1.0], scene);
  }
  // Appears as CLOSEST RIGHT bounded box
  S8 = BABYLON.MeshBuilder.CreatePlane("side8", playarea_height, scene);
  S8.scaling = new BABYLON.Vector3(goal_width / 2,  playarea_height, 1);
  S8.position.x = -(goal_width / 2 + goal_width / 4);
  S8.position.z = ground_length / 2;
  S8.position.y = playarea_yoff + (playarea_height / 2);
  // Use showPlayArea to view the boundaries
  if(showPlayArea) { S8.showBoundingBox = true; } else {
    loadMaterial(S8, "goalRight", loadTextures, loadTextures, [1.0, 1.0, 1.0], scene);
    S8.material.alpha = playarea_localOpacity;
  }
  // This creates and positions a follow camera for the main game
  Camera1 = new BABYLON.ArcRotateCamera("ArcRotateCamera", Math.PI / 2, Math.PI / 2.5, 14, new BABYLON.Vector3(0, 0, 0), scene);
  Camera1.applyGravity = true;
  Camera1.checkCollisions = true;
  Camera1.rotationOffset = 0;
  Camera1.lockedTarget = Player1;
  // This creates and positions a camera for the menu
  Camera2 = new BABYLON.ArcRotateCamera("ArcRotateCamera", Math.PI / 6, Math.PI / 3, 120, new BABYLON.Vector3(0, 0, 0), scene);
  Camera2.rotationOffset = Math.PI / 2;
  Camera2.lockedTarget = new BABYLON.Vector3(0, 0, 0);
  // This creates and positions a camera for the menu
  Camera3 = new BABYLON.ArcRotateCamera("ArcRotateCamera", Math.PI / 6, Math.PI / 6, 14, new BABYLON.Vector3(0, 0, 0), scene);
  Camera3.rotationOffset = -Math.PI / 6;
  Camera3.lockedTarget = Puck;
  // This creates and positions a camera for the menu
  Camera4 = new BABYLON.ArcRotateCamera("ArcRotateCamera", Math.PI / 8, Math.PI / 2.8, 60, new BABYLON.Vector3(0, 0, 0), scene);
  Camera4.rotationOffset = -Math.PI;
  Camera4.lockedTarget = new BABYLON.Vector3(0, 0, 0);
  // This creates and positions a camera for the menu
  Camera5 = new BABYLON.ArcRotateCamera("ArcRotateCamera", Math.PI / 3, Math.PI / 3, 90, new BABYLON.Vector3(0, 0, 0), scene);
  Camera5.lockedTarget = new BABYLON.Vector3(0, 0, 0);
  // Setting game camera
  scene.activeCamera = Camera2;
}
// Used in scene creation

/**
 * Creates hitboxes for each object and wall, enables use of physics engine. Gives puck and players their physical properties
 * @param {scene} scene scene object containing all gameplay elements
 */

function loadGameImposters(scene) {
  // Imposters for Babylon/Cannon's calculations
  Ground.physicsImpostor = new BABYLON.PhysicsImpostor(Ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: ground_restitution }, scene);
  Top.physicsImpostor = new BABYLON.PhysicsImpostor(Top, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: ground_restitution }, scene);
  S1.physicsImpostor = new BABYLON.PhysicsImpostor(S1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: playarea_restitution }, scene);
  S2.physicsImpostor = new BABYLON.PhysicsImpostor(S2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: playarea_restitution }, scene);
  S3.physicsImpostor = new BABYLON.PhysicsImpostor(S3, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: playarea_restitution }, scene);
  S4.physicsImpostor = new BABYLON.PhysicsImpostor(S4, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: playarea_restitution }, scene);
  S5.physicsImpostor = new BABYLON.PhysicsImpostor(S5, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: playarea_restitution }, scene);
  S6.physicsImpostor = new BABYLON.PhysicsImpostor(S6, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: playarea_restitution }, scene);
  S7.physicsImpostor = new BABYLON.PhysicsImpostor(S7, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: playarea_restitution }, scene);
  S8.physicsImpostor = new BABYLON.PhysicsImpostor(S8, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: playarea_restitution }, scene);
  // Player object imposters
  Player1.physicsImpostor = new BABYLON.PhysicsImpostor(Player1, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: player_mass, friction: player_friction, restitution: player_restitution }, scene);
  AI.physicsImpostor = new BABYLON.PhysicsImpostor(AI, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: player_mass, friction: player_friction, restitution: player_restitution }, scene);
  Puck.physicsImpostor = new BABYLON.PhysicsImpostor(Puck, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: puck_mass, friction: puck_friction, restitution: puck_restitution }, scene);
}
// Used in scene creation

/**
 * Pulls texture from server, or from parameters, and applies it to specified object
 * @param {mesh} object object to be textured
 * @param {string} textureid name of texture
 * @param {boolean} texture true if texture exists, false if not
 * @param {boolean} hasAlpha true if texture is at all transparent, false if not
 * @param {array} default_color array representing default color info in rgb format
 * @param {scene} scene scene object containing all gameplay elements
 *
 */

function loadMaterial(object /*BABYLON mesh*/, textureid /*title of the texture*/, texture /*Boolean*/, hasAlpha /*Boolean*/, default_color /*Array*/, scene /*BABYLON scene*/) {
  let _material = new BABYLON.StandardMaterial("texture_" + textureid, scene);
  if(texture && loadTextures) {
    _material.diffuseTexture = new BABYLON.Texture("assets/textures/texture_" + textureid + ".png", scene);
    if(hasAlpha) {
    	_material.diffuseTexture.hasAlpha = true;
    	_material.opacityTexture = new BABYLON.Texture("assets/textures/texture_" + textureid + ".png", scene);
    	// _material.bumpTexture = new BABYLON.Texture("assets/textures/texture_" + textureid + ".png", scene);
    	_material.ambientColor = new BABYLON.Color3(default_color[0], default_color[1], default_color[2]);
      _material.backFaceCulling = false;
    }else {
    	_material.specularColor = new BABYLON.Color3(default_color[0], default_color[1], default_color[2]);
    }
  }else {
    _material.diffuseColor = new BABYLON.Color3(default_color[0], default_color[1], default_color[2]);
  }
  object.material = _material;
}
