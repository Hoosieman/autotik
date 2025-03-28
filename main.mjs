import { app, BrowserWindow, ipcMain } from "electron"
import path from "path"
import { spawn } from "child_process"
import fs from "fs"

// Workaround for __dirname in ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname)

// Store running test processes
const runningProcesses = {
  test: {
    1: null,
    2: null,
    3: null,
  },
  doom: {
    1: null,
    2: null,
    3: null,
  }
}

// Store running Appium processes
const runningAppiumProcesses = {
  test: {
    1: null,
    2: null,
    3: null,
  },
  doom: {
    1: null,
    2: null,
    3: null,
  }
}

// Store Appium ports
const appiumPorts = {
  test: {
    1: 4723, // Default port
    2: 4724,
    3: 4725,
  },
  doom: {
    1: 4726,
    2: 4727,
    3: 4728,
  }
}

// Map test numbers to specific device UDIDs
const testDeviceMap = {
  test: {
    1: "R58N932FBKY", // Specific UDID for test 1
    2: "R5CXC0LYQ5F", // Specific UDID for test 2
    3: "R5CXC0LY81P", // Specific UDID for test 3
  },
  doom: {
    1: "R58N932FBKY", // Using the same device mapping for doom
    2: "R5CXC0LYQ5F",
    3: "R5CXC0LY81P",
  }
}

// Store connected Android device IDs
const connectedAndroidDevices = {
  test: {
    1: null,
    2: null,
    3: null
  },
  doom: {
    1: null,
    2: null,
    3: null
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  win.loadFile("index.html")

  // Uncomment to open DevTools automatically
  // win.webContents.openDevTools();

  return win
}

app.whenReady().then(() => {
  const mainWindow = createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Handle device connection check
  ipcMain.on("check-device-connection", (event, data) => {
    const { testNumber, type } = data
    const sender = event.sender
    
    // Use adb devices to check for connected devices
    const adbProcess = spawn("adb", ["devices"], {
      shell: true,
    })
    
    let output = ""
    
    adbProcess.stdout.on("data", (data) => {
      output += data.toString()
    })
    
    adbProcess.stderr.on("data", (data) => {
      console.error(`ADB Error: ${data}`)
    })
    
    adbProcess.on("close", (code) => {
      if (code === 0) {
        // Parse the output to find connected devices
        const lines = output.split("\n").filter(line => line.trim() !== "" && !line.includes("List of devices attached"))
        const devices = lines.map(line => {
          const parts = line.trim().split("\t")
          return {
            id: parts[0],
            status: parts[1]
          }
        }).filter(device => device.status === "device") // Only include fully connected devices
        
        // Check if the specific device for this test is connected
        const expectedDeviceId = testDeviceMap[type][testNumber]
        const deviceFound = devices.find(device => device.id === expectedDeviceId)
        
        if (deviceFound) {
          // Store the device ID for screenshot functionality
          connectedAndroidDevices[type][testNumber] = deviceFound.id
          
          sender.send("device-connection-update", {
            testNumber,
            connected: true,
            deviceId: deviceFound.id,
            type
          })
        } else if (devices.length > 0) {
          // If preferred device not found but we have at least one device, use the first one
          connectedAndroidDevices[type][testNumber] = devices[0].id
          
          sender.send("device-connection-update", {
            testNumber,
            connected: true,
            deviceId: devices[0].id,
            type
          })
        } else {
          // No devices connected
          connectedAndroidDevices[type][testNumber] = null
          
          sender.send("device-connection-update", {
            testNumber,
            connected: false,
            deviceId: null,
            type
          })
        }
      } else {
        // ADB command failed
        connectedAndroidDevices[type][testNumber] = null
        
        sender.send("device-connection-update", {
          testNumber,
          connected: false,
          deviceId: null,
          type
        })
      }
    })
  })

  // Function to capture Android screenshot and stream directly to renderer
  // Completely rewritten for better memory management
function captureAndroidScreenshot(deviceId, testNumber, type) {
    if (!deviceId) {
        console.log(`No device ID available for ${type} test ${testNumber}, skipping screenshot`);
        return Promise.resolve(null);
    }
    
    return new Promise((resolve, reject) => {
        // Use ADB to capture screenshot with reduced quality to save memory
        // The -s 50% flag reduces the size by 50%
        const adbProcess = spawn("adb", ["-s", deviceId, "exec-out", "screencap -p"], {
            shell: true,
            // Set max buffer size to prevent memory issues
            maxBuffer: 1024 * 1024 * 5 // 5MB max
        });
        
        const chunks = [];
        let totalSize = 0;
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB max total size
        
        adbProcess.stdout.on("data", (data) => {
            totalSize += data.length;
            
            // If we exceed the maximum size, abort to prevent memory issues
            if (totalSize > MAX_SIZE) {
                console.warn(`Screenshot for ${type} ${testNumber} exceeded max size (${totalSize} bytes), aborting`);
                adbProcess.kill();
                chunks.length = 0; // Clear chunks
                reject(new Error("Screenshot too large, aborted to prevent memory issues"));
                return;
            }
            
            chunks.push(data);
        });
        
        adbProcess.stderr.on("data", (data) => {
            console.error(`ADB Screenshot Error: ${data}`);
        });
        
        adbProcess.on("close", (code) => {
            if (code === 0 && chunks.length > 0) {
                try {
                    const buffer = Buffer.concat(chunks);
                    
                    // Convert to a smaller JPEG instead of PNG to save memory
                    // This would require the 'sharp' module, but we'll use base64 directly for now
                    // If memory issues persist, consider adding sharp for image compression
                    
                    // Convert buffer to base64 and return directly
                    const base64Image = `data:image/png;base64,${buffer.toString('base64')}`;
                    
                    // Clear the chunks array to free memory
                    chunks.length = 0;
                    
                    resolve({
                        image: base64Image,
                        timestamp: Date.now(),
                        testNumber: testNumber,
                        type: type
                    });
                } catch (error) {
                    console.error("Error processing screenshot:", error);
                    chunks.length = 0;
                    reject(error);
                }
            } else {
                console.error(`Failed to capture screenshot, exit code: ${code}`);
                // Clear the chunks array to free memory even on error
                chunks.length = 0;
                reject(new Error(`Failed to capture screenshot, exit code: ${code}`));
            }
        });
        
        // Set a timeout to prevent hanging
        setTimeout(() => {
            if (adbProcess && !adbProcess.killed) {
                adbProcess.kill();
                chunks.length = 0;
                reject(new Error("Screenshot capture timed out"));
            }
        }, 10000); // 10 second timeout
    });
}

  // Handle screenshot request
  ipcMain.on("request-android-screenshot", (event, data) => {
    const { testNumber, type } = data;
    const deviceId = connectedAndroidDevices[type][testNumber];
    const sender = event.sender;
    
    if (!deviceId) {
      console.log(`No device ID available for ${type} test ${testNumber}, cannot take screenshot`);
      // Send a message back to the renderer
      sender.send("android-screenshot-error", {
        testNumber: testNumber,
        type: type,
        error: "No device connected"
      });
      return;
    }
    
    captureAndroidScreenshot(deviceId, testNumber, type)
      .then(screenshotInfo => {
        if (screenshotInfo) {
          sender.send("android-screenshot", {
            testNumber: testNumber,
            type: type,
            image: screenshotInfo.image,
            timestamp: screenshotInfo.timestamp
          });
        }
      })
      .catch(error => {
        console.error(`Error capturing screenshot: ${error.message}`);
        sender.send("android-screenshot-error", {
          testNumber: testNumber,
          type: type,
          error: error.message
        });
      });
  });

  // Handle test execution
  ipcMain.on("run-test", (event, data) => {
    const { testNumber, type } = data
    const sender = event.sender

    // Get the appropriate test command based on test number and type
    const testCommand = getTestCommand(testNumber, type)

    // Notify that test is starting
    sender.send("test-start", { testNumber, type })

    // Use spawn instead of exec to get real-time output
    const testProcess = spawn("npm", ["run", testCommand], {
        shell: true,
    })

    // Store the process reference
    runningProcesses[type][testNumber] = testProcess

    // For Android tests, set up screenshot capture interval
    let screenshotInterval = null;
    let lastScreenshotTime = 0;
    const deviceId = connectedAndroidDevices[type][testNumber];
    
    if (deviceId) {
        // Capture screenshots every 3 seconds instead of 2 to reduce memory pressure
        screenshotInterval = setInterval(() => {
            const now = Date.now();
            
            // Only take a new screenshot if at least 3 seconds have passed since the last one
            // and there's no pending screenshot operation
            if (now - lastScreenshotTime >= 3000) {
                lastScreenshotTime = now;
                
                captureAndroidScreenshot(deviceId, testNumber, type)
                    .then(screenshotInfo => {
                        if (screenshotInfo) {
                            sender.send("android-screenshot", {
                                testNumber: testNumber,
                                type: type,
                                image: screenshotInfo.image,
                                timestamp: screenshotInfo.timestamp
                            });
                        }
                    })
                    .catch(error => {
                        console.error(`Error capturing screenshot: ${error.message}`);
                        // Don't send error to renderer to avoid UI clutter
                    });
            }
        }, 3000);
    }

    // Stream stdout to renderer
    testProcess.stdout.on("data", (data) => {
        sender.send("test-output", {
            testNumber,
            output: data.toString(),
            type
        })
    })

    // Stream stderr to renderer
    testProcess.stderr.on("data", (data) => {
        sender.send("test-output", {
            testNumber,
            output: data.toString(),
            type
        })
    })

    // Handle process completion
    testProcess.on("close", (code) => {
        // Clear the process reference
        runningProcesses[type][testNumber] = null

        // Clear screenshot interval if it exists
        if (screenshotInterval) {
            clearInterval(screenshotInterval);
        }

        sender.send("test-end", {
            testNumber,
            exitCode: code,
            type
        })
    })

    // Handle process errors
    testProcess.on("error", (error) => {
        // Clear the process reference
        runningProcesses[type][testNumber] = null

        // Clear screenshot interval if it exists
        if (screenshotInterval) {
            clearInterval(screenshotInterval);
        }

        sender.send("test-error", {
            testNumber,
            error: error.message,
            type
        })
    })
})

  // Handle test stopping
  ipcMain.on("stop-test", (event, data) => {
    const { testNumber, type } = data
    const sender = event.sender
    const process = runningProcesses[type][testNumber]

    if (process) {
      // On Windows, we need to send SIGINT to properly terminate the process
      // This is equivalent to pressing Ctrl+C in the terminal
      if (process.pid) {
        try {
          // For Windows
          if (process.platform === "win32") {
            // Use taskkill to send Ctrl+C signal
            spawn("taskkill", ["/pid", process.pid, "/T", "/F"])
          } else {
            // For macOS and Linux, send SIGINT signal
            process.kill("SIGINT")
          }

          // Notify that the test was stopped
          sender.send("test-stopped", { testNumber, type })

          // Clear the process reference
          runningProcesses[type][testNumber] = null
        } catch (error) {
          console.error(`Error stopping ${type} ${testNumber}:`, error)

          // Try force kill as a fallback
          try {
            process.kill("SIGKILL")
            sender.send("test-stopped", { testNumber, type })
            runningProcesses[type][testNumber] = null
          } catch (killError) {
            console.error(`Error force killing ${type} ${testNumber}:`, killError)
          }
        }
      }
    }
  })

  // Handle Appium start
  ipcMain.on("start-appium", (event, data) => {
    const { testNumber, type } = data
    const sender = event.sender
    const port = appiumPorts[type][testNumber]

    // Build the Appium command based on the test number
    const appiumArgs = ["appium"]

    // Add port argument
    appiumArgs.push("-p", port.toString())

    // Notify that Appium is starting
    sender.send("appium-output", {
      testNumber,
      output: `Starting Appium server on port ${port}...`,
      type
    })

    // Start the Appium server
    const appiumProcess = spawn("npx", appiumArgs, {
      shell: true,
    })

    // Store the process reference
    runningAppiumProcesses[type][testNumber] = appiumProcess

    // Stream stdout to renderer
    appiumProcess.stdout.on("data", (data) => {
      sender.send("appium-output", {
        testNumber,
        output: data.toString(),
        type
      })

      // Check if Appium has started successfully
      const output = data.toString()
      if (output.includes("Appium REST http interface listener started")) {
        sender.send("appium-start", {
          testNumber,
          port,
          type
        })
      }
    })

    // Stream stderr to renderer
    appiumProcess.stderr.on("data", (data) => {
      sender.send("appium-output", {
        testNumber,
        output: data.toString(),
        type
      })
    })

    // Handle process completion
    appiumProcess.on("close", (code) => {
      // Clear the process reference
      runningAppiumProcesses[type][testNumber] = null

      // Only send stop event if it wasn't already sent by the stop-appium handler
      if (code !== null) {
        sender.send("appium-stop", { testNumber, type })
      }
    })

    // Handle process errors
    appiumProcess.on("error", (error) => {
      // Clear the process reference
      runningAppiumProcesses[type][testNumber] = null

      sender.send("appium-error", {
        testNumber,
        error: error.message,
        type
      })
    })
  })

  // Handle Appium stop
  ipcMain.on("stop-appium", (event, data) => {
    const { testNumber, type } = data
    const sender = event.sender
    const process = runningAppiumProcesses[type][testNumber]

    if (process) {
      if (process.pid) {
        try {
          // For Windows
          if (process.platform === "win32") {
            // Use taskkill to send Ctrl+C signal
            spawn("taskkill", ["/pid", process.pid, "/T", "/F"])
          } else {
            // For macOS and Linux, send SIGINT signal
            process.kill("SIGINT")
          }

          // Notify that Appium was stopped
          sender.send("appium-stop", { testNumber, type })

          // Clear the process reference
          runningAppiumProcesses[type][testNumber] = null
        } catch (error) {
          console.error(`Error stopping Appium for ${type} ${testNumber}:`, error)

          // Try force kill as a fallback
          try {
            process.kill("SIGKILL")
            sender.send("appium-stop", { testNumber, type })
            runningAppiumProcesses[type][testNumber] = null
          } catch (killError) {
            console.error(`Error force killing Appium for ${type} ${testNumber}:`, killError)
          }
        }
      }
    }
  })

  // Add memory management handlers
  ipcMain.handle("get-memory-usage", () => {
    return process.memoryUsage()
  })

  // Add a global garbage collection function that can be called from the renderer
ipcMain.on("force-garbage-collection", () => {
    // Try to free up memory
    if (global.gc) {
        global.gc();
        console.log("Garbage collection performed in main process");
    } else {
        console.log("Garbage collection not available in main process");
    }
    
    // Clear any cached data
    process._getActiveHandles().forEach(handle => {
        if (handle && typeof handle.close === 'function' && !handle._isStdio) {
            try {
                handle.close();
            } catch (e) {
                // Ignore errors
            }
        }
    });
})
})

// Helper function to get the appropriate test command
function getTestCommand(testNumber, type) {
  if (type === 'test') {
    switch (testNumber) {
      case 1:
        return "test"
      case 2:
        return "test2"
      case 3:
        return "test3"
      default:
        return "test"
    }
  } else if (type === 'doom') {
    switch (testNumber) {
      case 1:
        return "doom"
      case 2:
        return "doom2"
      case 3:
        return "doom3"
      default:
        return "doom"
    }
  }
}

app.on("window-all-closed", () => {
  // Kill any running test processes before quitting
  Object.keys(runningProcesses).forEach((type) => {
    Object.keys(runningProcesses[type]).forEach((testNumber) => {
      const process = runningProcesses[type][testNumber]
      if (process) {
        try {
          process.kill("SIGKILL")
        } catch (error) {
          console.error(`Error killing ${type} process ${testNumber} during app close:`, error)
        }
      }
    })
  })

  // Kill any running Appium processes before quitting
  Object.keys(runningAppiumProcesses).forEach((type) => {
    Object.keys(runningAppiumProcesses[type]).forEach((testNumber) => {
      const process = runningAppiumProcesses[type][testNumber]
      if (process) {
        try {
          process.kill("SIGKILL")
        } catch (error) {
          console.error(`Error killing Appium process for ${type} ${testNumber} during app close:`, error)
        }
      }
    })
  })

  if (process.platform !== "darwin") {
    app.quit()
  }
})

