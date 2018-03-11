// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;

var camera, scene, renderer, bufferScene, bufferTexture;

var uniforms;


var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

init();
animate();


function init() {

  container = document.getElementById( 'banner' );

  camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 1, 1000 );
  camera.position.z = 1;

  scene = new THREE.Scene();

  var geometry = new THREE.PlaneBufferGeometry( 2, 2 );


  var noiseTexture = new THREE.TextureLoader().load( "/threejs/shader/allNoise512.png" );
  var pongTexture = new THREE.TextureLoader().load( "/threejs/shader/MOI.png" );

  uniforms = THREE.UniformsUtils.clone( THREE.BannerShader.uniforms );

  uniforms._pongTexture.value = pongTexture;
  uniforms._noiseTexture.value = noiseTexture;

  var material = new THREE.ShaderMaterial( {

    uniforms: uniforms,
    vertexShader: THREE.BannerShader.vertexShader,
    fragmentShader: THREE.BannerShader.fragmentShader,
    depthWrite : false

  } );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.setClearColor( 0x0059C1, 0);
  renderer.context.disable(renderer.context.DEPTH_TEST);

  container.appendChild( renderer.domElement );


  onWindowResize();






  var mesh1 = new THREE.Mesh( geometry, material );
  bufferScene1 = new THREE.Scene();
  bufferTexture1 = new THREE.WebGLRenderTarget( uniforms.resolution.value.x, uniforms.resolution.value.y, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

  bufferScene1.background = new THREE.Color( 0x0059C1 );

  bufferScene1.add( mesh1 );



  var mesh2 = new THREE.Mesh( geometry, material );
  bufferScene2 = new THREE.Scene();
  bufferTexture2 = new THREE.WebGLRenderTarget( uniforms.resolution.value.x, uniforms.resolution.value.y, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

  bufferScene2.background = new THREE.Color( 0x0059C1 );


  bufferScene2.add( mesh2 );

  var textureFinal = new THREE.MeshBasicMaterial({map:bufferTexture2.texture});
  var meshFinal = new THREE.Mesh( geometry, textureFinal );


  scene.add( meshFinal );


  window.addEventListener( 'resize', onWindowResize, false );

  window.addEventListener('mousemove', function(evt) {


    var rect = renderer.domElement.getBoundingClientRect();

    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;

    mouse.x = (x / rect.width ) * 2 - 1;
    mouse.y = (y / rect.height ) * 2 - 1;



  });

}

function onWindowResize( event ) {


  var width =   document.getElementById( 'banner' ).clientWidth ;
  var height = (720 * width ) / 2132;



  renderer.setSize( width, height);


  uniforms.resolution.value.x = renderer.domElement.width;
  uniforms.resolution.value.y = renderer.domElement.height;

}

//
function animate() {


  render();

  requestAnimationFrame( animate );

}


function render() {



  // update the picking ray with the camera and mouse position
  raycaster.setFromCamera( mouse, camera );

  // calculate objects intersecting the picking ray
  var intersects = raycaster.intersectObjects( scene.children );


  if(intersects.length > 0){
    uniforms._mousePos.value.x = intersects[0].uv.x;
    uniforms._mousePos.value.y = 1-intersects[0].uv.y;

  }
  // for ( var i = 0; i < intersects.length; i++ ) {
  //
  // 	//intersects[ i ].object.material.color.set( 0xff0000 );
  // 	console.log(intersects[i].uv);
  //
  // }



  uniforms.time.value = performance.now()/1000;

  uniforms._modifier.value = 1.1;
  uniforms._screenTexture.value = bufferTexture2.texture

  // renderer.clear();

  renderer.render(bufferScene1, camera, bufferTexture1);

  uniforms._modifier.value = -7.0;
  uniforms._screenTexture.value = bufferTexture1.texture
  // renderer.clear();

  renderer.render(bufferScene2, camera, bufferTexture2);


  renderer.render( scene, camera );

}
