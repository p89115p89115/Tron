import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

THREE.ColorManagement.enabled = true;

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  return renderer;
};

const hideLoadingUi = () => {
  const veil = document.getElementById("veil");
  if (veil) {
    veil.style.opacity = 0;
  }

  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    progressBar.style.opacity = 0;
  }

  const error = document.getElementById("error");
  if (error) {
    error.style.visibility = "hidden";
    error.style.pointerEvents = "none";
  }
};

export const startFallbackApp = async ({ updateLoadingProgressBar }) => {
  const renderer = createRenderer();

  const container = document.getElementById("container");
  if (!container) {
    throw new Error("Missing #container element");
  }

  container.appendChild(renderer.domElement);

  await updateLoadingProgressBar(0.1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x02040f);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.25, 5.5);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 3;
  controls.maxDistance = 12;

  await updateLoadingProgressBar(0.25);

  const ambientLight = new THREE.AmbientLight(0x203050, 0.75);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x6fa8ff, 1.1);
  keyLight.position.set(4, 6, 2);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x1d66ff, 0.4);
  fillLight.position.set(-4, -2, -3);
  scene.add(fillLight);

  await updateLoadingProgressBar(0.45);

  const geometry = new THREE.IcosahedronGeometry(1.6, 3);
  const material = new THREE.MeshStandardMaterial({
    color: 0x1f62ff,
    metalness: 0.2,
    roughness: 0.65,
    emissive: 0x0a1245,
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.95,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  scene.add(mesh);

  const innerGlow = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 2),
    new THREE.MeshBasicMaterial({
      color: 0x7fd4ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  scene.add(innerGlow);

  await updateLoadingProgressBar(0.65);

  const particles = new THREE.Points(
    new THREE.SphereGeometry(6.5, 48, 32),
    new THREE.PointsMaterial({
      color: 0x4cc9ff,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  particles.geometry.rotateX(Math.PI / 2);
  scene.add(particles);

  await updateLoadingProgressBar(0.85);

  window.addEventListener("resize", () => {
    const { innerWidth, innerHeight } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  });

  hideLoadingUi();

  const clock = new THREE.Clock();

  const animate = () => {
    const elapsed = clock.getElapsedTime();
    const delta = clock.getDelta();

    mesh.rotation.y += delta * 0.45;
    mesh.rotation.x = Math.sin(elapsed * 0.32) * 0.25;

    innerGlow.rotation.y -= delta * 0.18;
    innerGlow.rotation.x = Math.sin(elapsed * 0.21) * 0.3;

    particles.rotation.y += delta * 0.05;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);

  await updateLoadingProgressBar(1);
};
