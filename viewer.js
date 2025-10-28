import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

let camera, scene, renderer, mixer;
let clock = new THREE.Clock();

init();
animate();

function init() {
  const container = document.getElementById('model-viewer');
  
  camera = new THREE.PerspectiveCamera(
    100,
    container.clientWidth / container.clientHeight,
    0.25,
    20
  );
  camera.position.set(0, 0.1, 0);
  
  scene = new THREE.Scene();
  
  new RGBELoader()
    .setPath('assets/')
    .load('brown_photostudio_02_1k.hdr', function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      render();
      
      // model
      const loader = new GLTFLoader().setPath('assets/');
      loader.load('musician-test.glb', async function (gltf) {
        const model = gltf.scene;
        
        // wait until the model can be added to the scene without blocking due to shader compilation
        await renderer.compileAsync(model, camera, scene);
        scene.add(model);
        
        // Setup animation mixer and play all animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.play();
          });
        }
        
        render();
      });
    });
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild(renderer.domElement);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 1;
  controls.maxDistance = 6;
  controls.target.set(0, 0, -0.2);
  controls.update();
  
  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  const container = document.getElementById('model-viewer');
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  if (mixer) {
    mixer.update(delta);
  }
  
  render();
}