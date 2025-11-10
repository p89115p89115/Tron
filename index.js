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

const bootstrap = async () => {
  let started = false;

  if ("gpu" in navigator) {
    try {
      const { startApp } = await import("./src/main.js");
      await startApp({ updateLoadingProgressBar });
      started = true;
    } catch (error) {
      console.warn("Failed to start WebGPU experience", error);
    }
  }

  if (!started) {
    try {
      const { startFallbackApp } = await import("./src/fallbackMain.js");
      await startFallbackApp({ updateLoadingProgressBar });
      started = true;
    } catch (error) {
      console.error("Failed to start WebGL fallback", error);
    }
  }

  if (!started) {
    showError(
      "Couldn't initialize the experience in this browser. Try updating or using a different device."
    );
  }
};

bootstrap().catch((error) => {
  console.error(error);
  showError(
    "Couldn't initialize the experience in this browser. Try updating or using a different device."
  );
});
