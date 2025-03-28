const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
  // Test functions
  runTest: (testNumber, type = "test") => ipcRenderer.send("run-test", { testNumber, type }),
  stopTest: (testNumber, type = "test") => ipcRenderer.send("stop-test", { testNumber, type }),
  onTestStart: (callback) => ipcRenderer.on("test-start", callback),
  onTestOutput: (callback) => ipcRenderer.on("test-output", callback),
  onTestEnd: (callback) => ipcRenderer.on("test-end", callback),
  onTestError: (callback) => ipcRenderer.on("test-error", callback),
  onTestStopped: (callback) => ipcRenderer.on("test-stopped", callback),

  // Appium functions
  startAppium: (testNumber, type = "test") => ipcRenderer.send("start-appium", { testNumber, type }),
  stopAppium: (testNumber, type = "test") => ipcRenderer.send("stop-appium", { testNumber, type }),
  onAppiumStart: (callback) => ipcRenderer.on("appium-start", callback),
  onAppiumOutput: (callback) => ipcRenderer.on("appium-output", callback),
  onAppiumStop: (callback) => ipcRenderer.on("appium-stop", callback),
  onAppiumError: (callback) => ipcRenderer.on("appium-error", callback),

  // Device connection functions
  checkDeviceConnection: (testNumber, type = "test") =>
    ipcRenderer.send("check-device-connection", { testNumber, type }),
  onDeviceConnectionUpdate: (callback) => ipcRenderer.on("device-connection-update", callback),

  // Android screenshot functions
  requestAndroidScreenshot: (testNumber, type = "test") =>
    ipcRenderer.send("request-android-screenshot", { testNumber, type }),
  onAndroidScreenshot: (callback) => ipcRenderer.on("android-screenshot", callback),
  onAndroidScreenshotError: (callback) => ipcRenderer.on("android-screenshot-error", callback),

  // Memory management functions - enhanced
  getMemoryUsage: () => ipcRenderer.invoke("get-memory-usage"),
  forceGarbageCollection: () => {
    // First try to clean up in the renderer process
    if (window.gc) {
      window.gc()
    }

    // Then request cleanup in the main process
    ipcRenderer.send("force-garbage-collection")

    // Clear any browser caches if possible
    if (window.caches && typeof window.caches.keys === "function") {
      window.caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          window.caches.delete(cacheName)
        })
      })
    }

    return true
  },
})

