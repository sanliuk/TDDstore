import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Setup
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xcccccc, 50, 65);

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
camera.position.setX(-3);

renderer.render(scene, camera);

// + 3D
const loader = new GLTFLoader();
const modelPath = "./logo.glb"; // Percorso del modello .glb
const colors = [0xffff00, 0xff0000, 0x0000ff, 0x00ff00]; // Giallo, Rosso, Blu, Verde
loader.load(modelPath, function (gltf) {
  const model = gltf.scene;

  // Genera le stelle
  for (let i = 0; i < 200; i++) {
    const star = model.clone(); // Crea una copia del modello per ogni stella

    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(100));
    const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Scegli un colore casuale dalla lista colors

    star.position.set(x, y, z);
    star.rotation.x = Math.PI / 2; // Ruota di 90 gradi su X

    // Imposta il colore del materiale
    star.traverse(function (child) {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({ color: randomColor });
      }
    });

    star.scale.set(30, 30, 30); // Imposta la scala del modello
    scene.add(star);
  }
});

// Creazione dell'icosaedro wireframe con più poligoni
const detail = 2; // Numero di suddivisioni
const icosphereGeometry = new THREE.IcosahedronBufferGeometry(10, detail);
const wireframeGeometry = new THREE.WireframeGeometry(icosphereGeometry);

const material = new THREE.LineBasicMaterial({ color: 0x0099ff });
const wireframe = new THREE.LineSegments(wireframeGeometry, material);
wireframe.scale.set(0.3, 0.3, 0.3); // Applica una scala di riduzione del 50%
wireframe.position.set(1.7, 0, -4); // Imposta le coordinate di traslazione sul piano XZ

scene.add(wireframe);

// Lights
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Background
const spaceTexture = new THREE.TextureLoader().load("space4.jpg");
scene.background = spaceTexture;

// Avatar
const jeffTexture = new THREE.TextureLoader().load("cubo.png");
const jeff = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: jeffTexture })
);
scene.add(jeff);

// Moon
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
const normalTexture = new THREE.TextureLoader().load("normal.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);
scene.add(moon);
moon.position.z = 30;
moon.position.setX(-10);

jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  jeff.rotation.y += 0.01;
  jeff.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  wireframe.rotation.x += 0.01;
  wireframe.rotation.y += 0.005;
  wireframe.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  renderer.render(scene, camera);
}

animate();
