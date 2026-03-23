import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// SCENE — NO background so HTML canvas shows through
const scene = new THREE.Scene();
// NO scene.background — keep it null for full transparency
scene.fog = new THREE.FogExp2(0x000000, 0.018);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 25);

// RENDERER — alpha: true makes it transparent
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0); // fully transparent clear
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// LIGHTING
const ambient = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambient);

const frontLight = new THREE.PointLight(0xffffff, 6);
frontLight.position.set(0, 5, 15);
scene.add(frontLight);

const cyanLight = new THREE.PointLight(0x00ffee, 4);
cyanLight.position.set(10, 3, 5);
scene.add(cyanLight);

const backLight = new THREE.PointLight(0xcc00ff, 3);
backLight.position.set(-10, 5, -10);
scene.add(backLight);

// LOAD WITCH MODEL
const loader = new GLTFLoader();
let witch;

loader.load('models/witch.glb', (gltf) => {
  witch = gltf.scene;
  witch.scale.set(12, 12, 12);

  // Start closer so it's visible immediately
  witch.position.set(0, 0, -10);

  scene.add(witch);
});

// PARTICLES
const particlesGeometry = new THREE.BufferGeometry();
const count = 1500;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 80;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.12,
  color: 0x00ffee,
  transparent: true,
  opacity: 0.25
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ANIMATE
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  if (witch) {
    witch.position.z += 0.08;
    witch.position.x = Math.sin(time) * 3;
    witch.position.y = Math.sin(time * 2) * 1.2;
    witch.rotation.z = Math.sin(time) * 0.2;

    // Loop reset
    if (witch.position.z > 10) {
      witch.position.z = -40;
    }
  }

  particles.rotation.y += 0.0007;
  renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});