import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

// 1. SCENE SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 25);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 2. LIGHTING
const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);
const pointLight = new THREE.PointLight(0x00ffee, 5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// 3. WITCH MODEL
const loader = new GLTFLoader();
let witch;
loader.load('models/witch.glb', (gltf) => {
    witch = gltf.scene;
    witch.scale.set(12, 12, 12);
    witch.position.set(0, 0, -10);
    scene.add(witch);
});

// 4. THEME & UTILS
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    renderer.setClearColor(isLight ? 0xf1f5f9 : 0x030712, isLight ? 1 : 0);
});

// Intersection Observer for Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
document.querySelectorAll('.section').forEach(s => observer.observe(s));

// 5. ANIMATION
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    if (witch) {
        witch.position.z += 0.05;
        witch.position.y = Math.sin(time) * 1;
        if (witch.position.z > 15) witch.position.z = -40;
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});