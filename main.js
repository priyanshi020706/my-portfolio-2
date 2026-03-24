// Changed these to CDN links so GitHub doesn't ask for package-lock.json
import * as THREE from 'https://esm.sh/three@0.160.0';
import { GLTFLoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
// SCENE
const scene = new THREE.Scene();
// Changed to 'let' so we can update it later
let fog = new THREE.FogExp2(0x000000, 0.018);
scene.fog = fog;

// CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 25);

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0x000000, 0); 
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

// --- THEME TOGGLE SYNC ---
const themeBtn = document.getElementById('theme-toggle');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    // Small delay to ensure the body class has finished toggling
    setTimeout(() => {
        const isLight = document.body.classList.contains('light-mode');

        // 1. Update Fog Color (Matches the CSS background hex)
        scene.fog.color.setHex(isLight ? 0xf4f7f6 : 0x000000);

        // 2. Update Ambient Light (Brighter witch in light mode)
        ambient.intensity = isLight ? 2.5 : 1.2;

        // 3. Update Particles
        particlesMaterial.color.setHex(isLight ? 0x0077ff : 0x00ffee);
        particlesMaterial.opacity = isLight ? 0.5 : 0.25;

        // 4. THE FIX: Update Renderer Clear Color
        // This makes the 3D background match your CSS exactly
        // Syntax: renderer.setClearColor(color, opacity)
        renderer.setClearColor(isLight ? 0xf4f7f6 : 0x000000, isLight ? 1 : 0);
        
    }, 10);
  });
}

/// 1. Setup Mouse Tracking (Add this outside the function)
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', (event) => {
  // Converts mouse position to a coordinate system Three.js understands (-1 to +1)
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// 2. Updated ANIMATE
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  if (witch) {
    // Movement Logic
    witch.position.z += 0.08;
    witch.position.x = Math.sin(time) * 3;
    witch.position.y = Math.sin(time * 2) * 1.2;
    
    // Magical Tilting: The witch now "leans" into her turns
    witch.rotation.z = Math.sin(time) * 0.2;
    witch.rotation.y = (mouseX * 0.5); // Witch subtly looks toward your mouse
    
    // Reset position
    if (witch.position.z > 10) witch.position.z = -40;
  }

  // MAGICAL EFFECT: Particles now drift subtly toward your mouse cursor
  // This makes the "space" feel interactive and alive
  particles.rotation.y += 0.0007;
  particles.position.x += (mouseX * 0.5 - particles.position.x) * 0.02;
  particles.position.y += (mouseY * 0.5 - particles.position.y) * 0.02;

  renderer.render(scene, camera);
}

animate();
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});
// RESPONSIVE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});