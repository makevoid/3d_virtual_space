console.log("murka murka")


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer(); renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material ); scene.add( cube );
camera.position.z = 5;


// orbit controls

controls = new THREE.OrbitControls( camera )
controls.addEventListener('change', render )

var dae


/// collada
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load( '/collada/3d_virtuale.dae', function ( collada ) {

  dae = collada.scene;
  var skin = collada.skins[ 0 ];

  dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
  dae.updateMatrix();

  // // init();
  // // animate();

  // render();
} );



function render() {
  requestAnimationFrame(render);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;




  scene.add( dae );

  particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
  scene.add( particleLight );

  renderer.render(scene, camera);
}

