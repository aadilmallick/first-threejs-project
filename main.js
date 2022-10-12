import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//* base setup

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

// * adding a shape, given geometry and material
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
  wireframe: true,
});

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// * adding lights:
// * point light is a directional light source
// * ambient light lights up everything around equally
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// * adding helpers
// * light helper; visually show where the light source is coming from.
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// * grid helper: draw a grid line on the canvas
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// * add panning mouse to move around scene
const controls = new OrbitControls(camera, renderer.domElement);

// * function to add object to scene
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = [1, 2, 3].map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

// * Game Loop
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

// * setting background of scene to be an image.
const rockyTexture = new THREE.TextureLoader().load("/rockylaying.jpg");
scene.background = rockyTexture;

// * texture mapping: combining picture with 3d object
const aadilTexture = new THREE.TextureLoader().load("/aadilstanding.jpg");
const aadil = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: aadilTexture })
);
scene.add(aadil);

animate();

for (let i = 0; i < 200; i++) {
  addStar();
}

let moon;
function createMoon() {
  const projectTexture = new THREE.TextureLoader().load(
    "/canvasparticle-min.png"
  );
  moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({ map: projectTexture })
  );
  moon.position.z = 30;
  moon.position.setX(-10);
  scene.add(moon);
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  aadil.rotation.x += 0.05;
  aadil.rotation.y += 0.075;
  aadil.rotation.z += 0.05;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
createMoon();
