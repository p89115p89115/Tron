const updateLoadingProgressBar = async (frac, delay = 200) => {
  return new Promise((resolve) => {
    const progress = document.getElementById("progress");
    if (progress) {
      // 200px is the width of the progress bar defined in index.html
      progress.style.width = `${frac * 200}px`;
    }
    setTimeout(resolve, delay);
  });
};

const showError = (message) => {
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    progressBar.style.opacity = 0;
  }

  const error = document.getElementById("error");
  if (error) {
    error.style.visibility = "visible";
    error.style.pointerEvents = "auto";
    error.innerText = `Error: ${message}`;
  }
};

const ensureWebGPUAdapter = async () => {
  if (!("gpu" in navigator)) {
    showError("Your device does not support WebGPU.");
    return null;
  }

  let adapter;

  try {
    adapter = await navigator.gpu.requestAdapter();
  } catch (err) {
    console.warn("navigator.gpu.requestAdapter() failed", err);
  }

  if (!adapter) {
    showError(
      "Couldn't initialize WebGPU. Make sure WebGPU is supported by your Browser!"
    );
    return null;
  }

  return adapter;
};

const bootstrap = async () => {
  const adapter = await ensureWebGPUAdapter();
  if (!adapter) {
    return;
  }

  try {
    const { startApp } = await import("./src/main.js");
    await startApp({ updateLoadingProgressBar });
  } catch (error) {
    console.error("Failed to start WebGPU experience", error);
    showError(
      "Couldn't initialize WebGPU. Make sure WebGPU is supported by your Browser!"
    );
  }
};

bootstrap().catch((error) => {
  console.error(error);
  showError("Couldn't initialize WebGPU. Make sure WebGPU is supported by your Browser!");
});
