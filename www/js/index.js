/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};

var scene, camera, controls, renderer, effect;
var redball01Sprite, redballVisible;

function init() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(90, width/height, 0.1, 500);
  camera.position.y = 2;
  camera.position.z = 0;
  scene.add(camera);

  controls = new THREE.DeviceOrientationControls(camera);

  // Backdrop
  var backdrop = new THREE.SphereGeometry(500, 16, 8);
  backdrop.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

  var material = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('img/beach-360.jpg')
  });

  var backdropMesh = new THREE.Mesh(backdrop, material);
  scene.add(backdropMesh);

  // 2D sprites
  var spriteMap = THREE.ImageUtils.loadTexture('img/sprite.png');
  var spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap, depthTest: false
  });

  redballVisible = true;

  redball01Sprite = new THREE.Sprite(spriteMaterial);
  redball01Sprite.scale.set(1, 1, 1);
  redball01Sprite.position.x = -3;
  redball01Sprite.position.y = -3;
  redball01Sprite.position.z = -8;
  camera.add(redball01Sprite);

  renderer = new THREE.WebGLRenderer();
  //renderer.autoClear = false;

  effect = new THREE.StereoEffect(renderer);
  effect.separation = 0.5;
  effect.setSize(width, height);

  document.body.appendChild(renderer.domElement);
}

function render() {
  requestAnimationFrame(render);

  if (redballVisible) {
    redball01Sprite.position.z = -8;
  } else {
    redball01Sprite.position.z = 10;
  }

  controls.update();
  effect.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  effect.setSize(window.innerWidth, window.innerHeight);
}

function listeners() {
  // Listen for magnet trigger
  document.addEventListener('deviceready', function(event) {
    AndroidFullScreen.immersiveMode(false, null, null);

    var magnetsuccess = function() {
      console.log('magnet success');

      redballVisible = !redballVisible;
    };

    var magnetfail = function() {
      console.log('magnet fail');
    };

    navigator.magnetsensor.onCardboardTriggerListener(magnetsuccess, magnetfail);
  });

  document.addEventListener('pause', function(event) {
    navigator.magnetsensor.stopSensor
  });

  // Disable volume buttons
  document.addEventListener("volumeupbutton", function() {}, false);
  document.addEventListener("volumedownbutton", function() {}, false);

  // React to window resize events
  window.addEventListener('resize', onWindowResize, false);
}

listeners();
app.initialize();
init();
render();