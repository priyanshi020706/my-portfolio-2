import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
 
// ===== SCENE SETUP =====
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 25);
 
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // always transparent so CSS bg shows through
document.body.appendChild(renderer.domElement);
 
// Fade canvas in smoothly after a short delay so there's no flash
setTimeout(() => {
    renderer.domElement.classList.add('ready');
}, 400);
 
// ===== LIGHTING =====
const ambient = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambient);
const pointLight = new THREE.PointLight(0x00ffee, 5);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
 
// ===== WITCH MODEL =====
const loader = new GLTFLoader();
let witch;
loader.load('models/witch.glb', (gltf) => {
    witch = gltf.scene;
    witch.scale.set(12, 12, 12);
    witch.position.set(0, 0, -10);
    scene.add(witch);
});
 
// ===== THEME TOGGLE =====
const themeBtn = document.getElementById('theme-toggle');
const icon = themeBtn.querySelector('i');
 
function setTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light-mode');
        icon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('light-mode');
        icon.className = 'fa-solid fa-moon';
    }
}
 
// Persist theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') setTheme(true);
 
themeBtn.addEventListener('click', () => {
    const isLight = !document.body.classList.contains('light-mode');
    setTheme(isLight);
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});
 
// ===== SCROLL PROGRESS BAR =====
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
}, { passive: true });
 
// ===== INTERSECTION OBSERVER — SECTION REVEAL =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.08 });
 
document.querySelectorAll('.section').forEach(s => observer.observe(s));
 
// ===== ANIMATION LOOP =====
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
 
// ===== RESIZE =====
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});