if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


var controls

var container, stats;

var camera, scene, renderer, objects;
var dae, skin;

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( './collada/3d_virtuale.dae', function ( collada ) {

  dae = collada.scene;
  skin = collada.skins[ 0 ];

  dae.scale.x = dae.scale.y = dae.scale.z = 0.2;
  dae.updateMatrix();
  dae.position.x = -4;
  dae.position.y = 0;
  dae.position.z = 4;
  init();
  animate();

} );

function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( 2, 2, 3 );

  scene = new THREE.Scene();


  // controls = new THREE.OrbitControls( camera )
  // controls.addEventListener('change', render )


  controls = new THREE.FirstPersonControls(camera);
  controls.movementSpeed = 1000;
  controls.lookSpeed = 0.125;
  controls.lookVertical = false;

  // Grid

  var size = 14, step = 1;

  var geometry = new THREE.Geometry();
  var material = new THREE.LineBasicMaterial( { color: 0x303030 } );

  for ( var i = - size; i <= size; i += step ) {

    geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
    geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

    geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
    geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );

  }

  var line = new THREE.Line( geometry, material, THREE.LinePieces );
  scene.add( line );

  // Add the COLLADA

  scene.add( dae );


  // Lights

  scene.add( new THREE.AmbientLight( 0x666666 ) );

  var directionalLight = new THREE.DirectionalLight(/*Math.random() * 0xffffff*/0xeeeeee );
  directionalLight.position.x = Math.random()*2 - 0.5;
  directionalLight.position.y = Math.random()*2 - 0.5;
  directionalLight.position.z = Math.random()*2 - 0.5;
  directionalLight.position.normalize();
  scene.add( directionalLight );



  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );

  // stats = new Stats();
  // stats.domElement.style.position = 'absolute';
  // stats.domElement.style.top = '0px';
  // container.appendChild( stats.domElement );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

//

var t = 0;
var clock = new THREE.Clock();


function animate() {

  var delta = clock.getDelta();

  controls.update(delta);

  requestAnimationFrame( animate );

  if ( t > 1 ) t = 0;

  if ( skin ) {

    // guess this can be done smarter...

    // (Indeed, there are way more frames than needed and interpolation is not used at all
    //  could be something like - one morph per each skinning pose keyframe, or even less,
    //  animation could be resampled, morphing interpolation handles sparse keyframes quite well.
    //  Simple animation cycles like this look ok with 10-15 frames instead of 100 ;)

    for ( var i = 0; i < skin.morphTargetInfluences.length; i++ ) {

      skin.morphTargetInfluences[ i ] = 0;

    }

    skin.morphTargetInfluences[ Math.floor( t * 30 ) ] = 1;

    t += delta;

  }

  render();
  // stats.update();

}

function render() {

  var timer = Date.now() * 0.0004;

  // camera.position.x = Math.cos( timer ) * 20;
  // camera.position.y = 2;
  // camera.position.z = Math.sin( timer ) * 20;

  // camera.lookAt( scene.position );



  renderer.render( scene, camera );

}

// click handler

function getPosition(event) {
  var x = event.x;
  var y = event.y;

  var canvas = document.querySelector('canvas');

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;

  //alert("x:" + ((x / WIDTH) / 1) + " y:" + (-(y / HEIGHT) / 1.2));
  var vector = new THREE.Vector3((x / WIDTH) * 2 - 1, -(y / HEIGHT) * 2 + 1, 0.5);

  projector.unprojectVector(vector, camera);
  var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
  var intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
      intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
  }
}

document.querySelector('canvas').addEventListener("mousedown", getPosition, false);