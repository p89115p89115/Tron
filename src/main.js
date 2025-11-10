import * as THREE from "three/webgpu";
import App from "./app.js";

THREE.ColorManagement.enabled = true;

const createRenderer = () => {
  const renderer = new THREE.WebGPURenderer({
    //forceWebGL: true,
    //antialias: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  return renderer;
};

export const startApp = async ({ updateLoadingProgressBar }) => {
  const renderer = createRenderer();

  const container = document.getElementById("container");
  if (!container) {
    throw new Error("Missing #container element");
  }

  container.appendChild(renderer.domElement);

  const app = new App(renderer);

  try {
    await app.init(updateLoadingProgressBar);
  } catch (error) {
    throw new Error("Failed to initialize app", { cause: error });
  }

  if (!renderer.backend?.isWebGPUBackend) {
    throw new Error("Renderer backend is not WebGPU");
  }

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    app.resize(window.innerWidth, window.innerHeight);
  });

  const veil = document.getElementById("veil");
  if (veil) {
    veil.style.opacity = 0;
  }

  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    progressBar.style.opacity = 0;
  }

  const clock = new THREE.Clock();

  const animate = async () => {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();
    await app.update(delta, elapsed);
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};
