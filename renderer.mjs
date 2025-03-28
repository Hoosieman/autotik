// Tab functionality
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Add this at the beginning of your renderer.mjs file
document.addEventListener("DOMContentLoaded", () => {
    // Add TikTok theme class to body
    document.body.classList.add('tiktok-theme');
    
    // Rest of your existing code...
});

// Debug function to help identify element ID issues
function debugElementIds() {
    console.log("Debugging element IDs:");
    
    // Check engage tab elements
    console.log("Engage tab elements:");
    for (let i = 1; i <= 3; i++) {
        const appiumStatusId = `appiumStatus${i}`;
        const appiumStatus = document.getElementById(appiumStatusId);
        console.log(`appiumStatus${i} exists:`, !!appiumStatus);
    }
    
    // Check doom tab elements
    console.log("Doom tab elements:");
    for (let i = 1; i <= 3; i++) {
        const doomAppiumStatusId = `doomAppiumStatus${i}`;
        const doomAppiumStatus = document.getElementById(doomAppiumStatusId);
        console.log(`doomAppiumStatus${i} exists:`, !!doomAppiumStatus);
    }
}

// Function to limit log entries to prevent memory bloat
function limitLogEntries(logsContainer, maxEntries = 500) {
    // If we have more than maxEntries children, remove the oldest ones
    while (logsContainer.childElementCount > maxEntries) {
        logsContainer.removeChild(logsContainer.firstChild);
    }
}

// Enhanced cleanup function to ensure all memory is freed
function cleanupScreenshots(testNumber, type) {
    let deviceScreenElement;
    
    if (type === 'test') {
        deviceScreenElement = document.getElementById(`deviceScreen${testNumber}`);
    } else if (type === 'doom') {
        deviceScreenElement = document.getElementById(`doomDeviceScreen${testNumber}`);
    }
    
    if (deviceScreenElement) {
        // Find all image elements and clean them up
        const imgElements = deviceScreenElement.querySelectorAll("img");
        imgElements.forEach(img => {
            // Revoke the blob URL if it exists
            if (img.src && img.src.startsWith('blob:')) {
                URL.revokeObjectURL(img.src);
            }
            
            // Also check for stored blob URLs in dataset
            if (img.dataset.blobUrl) {
                URL.revokeObjectURL(img.dataset.blobUrl);
            }
            
            // Remove the image element completely
            img.remove();
        });
        
        // Add a placeholder text
        deviceScreenElement.textContent = "Test stopped. Screenshots cleared.";
    }
}

// Add a more aggressive memory management function
function performGlobalMemoryCleanup() {
    console.log("Performing global memory cleanup...");
    
    // Clean up all screenshot containers
    for (let i = 1; i <= 3; i++) {
        cleanupScreenshots(i, 'test');
        cleanupScreenshots(i, 'doom');
    }
    
    // Limit logs in all containers
    const allLogContainers = document.querySelectorAll('.logs-container');
    allLogContainers.forEach(container => {
        limitLogEntries(container, 100); // Reduced from 200 to 100
    });
    
    // Force garbage collection
    if (window.electron.forceGarbageCollection) {
        window.electron.forceGarbageCollection();
    }
    
    // Clear any cached data in the window object
    if (window.gc) {
        window.gc();
    }
}

// Set default active tab
document.querySelector('.tab[data-tab="home"]').classList.add('active');
document.getElementById('home').classList.add('active');

// Add click event listeners to tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        const tabId = tab.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        // Check device connections based on the active tab
        if (tabId === 'engage') {
            checkAllDeviceConnections('test');
        } else if (tabId === 'doom') {
            checkAllDeviceConnections('doom');
        }
        
        // Clear logs from inactive tabs to save memory
        const inactiveTabs = Array.from(tabContents).filter(content => !content.classList.contains('active'));
        inactiveTabs.forEach(tab => {
            const logContainers = tab.querySelectorAll('.logs-container');
            logContainers.forEach(container => {
                // Limit to fewer entries for inactive tabs
                limitLogEntries(container, 100);
            });
        });
    });
});

// Get toggle buttons for Engage tab
const toggleTest1Button = document.getElementById("toggleTest1Button")
const toggleTest2Button = document.getElementById("toggleTest2Button")
const toggleTest3Button = document.getElementById("toggleTest3Button")

const toggleAppium1Button = document.getElementById("toggleAppium1Button")
const toggleAppium2Button = document.getElementById("toggleAppium2Button")
const toggleAppium3Button = document.getElementById("toggleAppium3Button")

// Get toggle buttons for Doom tab
const toggleDoom1Button = document.getElementById("toggleDoom1Button")
const toggleDoom2Button = document.getElementById("toggleDoom2Button")
const toggleDoom3Button = document.getElementById("toggleDoom3Button")

const toggleDoomAppium1Button = document.getElementById("toggleDoomAppium1Button")
const toggleDoomAppium2Button = document.getElementById("toggleDoomAppium2Button")
const toggleDoomAppium3Button = document.getElementById("toggleDoomAppium3Button")

// Get status elements for Engage tab
const appiumStatus1 = document.getElementById("appiumStatus1")
const appiumStatus2 = document.getElementById("appiumStatus2")
const appiumStatus3 = document.getElementById("appiumStatus3")

const logsContainer1 = document.getElementById("logsContainer1")
const logsContainer2 = document.getElementById("logsContainer2")
const logsContainer3 = document.getElementById("logsContainer3")

const status1Element = document.getElementById("status1")
const status2Element = document.getElementById("status2")
const status3Element = document.getElementById("status3")

const deviceStatus1 = document.getElementById("deviceStatus1")
const deviceStatus2 = document.getElementById("deviceStatus2")
const deviceStatus3 = document.getElementById("deviceStatus3")

const refreshDevice1 = document.getElementById("refreshDevice1")
const refreshDevice2 = document.getElementById("refreshDevice2")
const refreshDevice3 = document.getElementById("refreshDevice3")

// Get status elements for Doom tab
const doomAppiumStatus1 = document.getElementById("doomAppiumStatus1")
const doomAppiumStatus2 = document.getElementById("doomAppiumStatus2")
const doomAppiumStatus3 = document.getElementById("doomAppiumStatus3")

const doomLogsContainer1 = document.getElementById("doomLogsContainer1")
const doomLogsContainer2 = document.getElementById("doomLogsContainer2")
const doomLogsContainer3 = document.getElementById("doomLogsContainer3")

const doomStatus1Element = document.getElementById("doomStatus1")
const doomStatus2Element = document.getElementById("doomStatus2Element")
const doomStatus3Element = document.getElementById("doomStatus3Element")

const doomDeviceStatus1 = document.getElementById("doomDeviceStatus1")
const doomDeviceStatus2 = document.getElementById("doomDeviceStatus2")
const doomDeviceStatus3 = document.getElementById("doomDeviceStatus3")

const refreshDoomDevice1 = document.getElementById("refreshDoomDevice1")
const refreshDoomDevice2 = document.getElementById("refreshDoomDevice2")
const refreshDoomDevice3 = document.getElementById("refreshDoomDevice3")

// Get device screen elements for Engage tab
const deviceScreen1 = document.getElementById("deviceScreen1")
const deviceScreen2 = document.getElementById("deviceScreen2")
const deviceScreen3 = document.getElementById("deviceScreen3")

const deviceInfo1 = document.getElementById("deviceInfo1")
const deviceInfo2 = document.getElementById("deviceInfo2")
const deviceInfo3 = document.getElementById("deviceInfo3")

const screenshotButton1 = document.getElementById("screenshotButton1")
const screenshotButton2 = document.getElementById("screenshotButton2")
const screenshotButton3 = document.getElementById("screenshotButton3")

// Get device screen elements for Doom tab
const doomDeviceScreen1 = document.getElementById("doomDeviceScreen1")
const doomDeviceScreen2 = document.getElementById("doomDeviceScreen2")
const doomDeviceScreen3 = document.getElementById("doomDeviceScreen3")

const doomDeviceInfo1 = document.getElementById("doomDeviceInfo1")
const doomDeviceInfo2 = document.getElementById("doomDeviceInfo2")
const doomDeviceInfo3 = document.getElementById("doomDeviceInfo3")

const doomScreenshotButton1 = document.getElementById("doomScreenshotButton1")
const doomScreenshotButton2 = document.getElementById("doomScreenshotButton2")
const doomScreenshotButton3 = document.getElementById("doomScreenshotButton3")

// Set up device refresh buttons for Engage tab
refreshDevice1.addEventListener("click", () => window.electron.checkDeviceConnection(1, 'test'))
refreshDevice2.addEventListener("click", () => window.electron.checkDeviceConnection(2, 'test'))
refreshDevice3.addEventListener("click", () => window.electron.checkDeviceConnection(3, 'test'))

// Set up device refresh buttons for Doom tab
refreshDoomDevice1.addEventListener("click", () => window.electron.checkDeviceConnection(1, 'doom'))
refreshDoomDevice2.addEventListener("click", () => window.electron.checkDeviceConnection(2, 'doom'))
refreshDoomDevice3.addEventListener("click", () => window.electron.checkDeviceConnection(3, 'doom'))

// Set up screenshot buttons for Engage tab
screenshotButton1.addEventListener("click", () => window.electron.requestAndroidScreenshot(1, 'test'))
screenshotButton2.addEventListener("click", () => window.electron.requestAndroidScreenshot(2, 'test'))
screenshotButton3.addEventListener("click", () => window.electron.requestAndroidScreenshot(3, 'test'))

// Set up screenshot buttons for Doom tab
doomScreenshotButton1.addEventListener("click", () => window.electron.requestAndroidScreenshot(1, 'doom'))
doomScreenshotButton2.addEventListener("click", () => window.electron.requestAndroidScreenshot(2, 'doom'))
doomScreenshotButton3.addEventListener("click", () => window.electron.requestAndroidScreenshot(3, 'doom'))

// Function to check all device connections
function checkAllDeviceConnections(type = 'test') {
    for (let i = 1; i <= 3; i++) {
        window.electron.checkDeviceConnection(i, type)
    }
}

// Handle device connection updates
window.electron.onDeviceConnectionUpdate((event, data) => {
    const { testNumber, connected, deviceId, type } = data
    
    let deviceStatusElement
    let deviceLabel
    let deviceScreenElement
    
    if (type === 'test') {
        deviceStatusElement = document.getElementById(`deviceStatus${testNumber}`)
        deviceLabel = "Device"
        deviceScreenElement = document.getElementById(`deviceScreen${testNumber}`)
    } else if (type === 'doom') {
        deviceStatusElement = document.getElementById(`doomDeviceStatus${testNumber}`)
        deviceLabel = "Device"
        deviceScreenElement = document.getElementById(`doomDeviceScreen${testNumber}`)
    }
    
    if (deviceStatusElement) {
        if (connected) {
            deviceStatusElement.className = "device-status device-connected"
            deviceStatusElement.querySelector("span").textContent = `${deviceLabel}: Connected (${deviceId})`
            
            // Update device screen if applicable
            if (deviceScreenElement) {
                deviceScreenElement.textContent = "Device connected. Waiting for test to start..."
            }
        } else {
            deviceStatusElement.className = "device-status device-disconnected"
            deviceStatusElement.querySelector("span").textContent = `${deviceLabel}: Not connected`
            
            // Update device screen if applicable
            if (deviceScreenElement) {
                deviceScreenElement.textContent = "No device connected"
            }
        }
    }
})

// Completely rewrite the screenshot handling function to be much more aggressive with memory cleanup
window.electron.onAndroidScreenshot((event, data) => {
    const { testNumber, type, image, timestamp } = data
    
    let deviceScreenElement
    let deviceInfoElement
    
    if (type === 'test') {
        deviceScreenElement = document.getElementById(`deviceScreen${testNumber}`)
        deviceInfoElement = document.getElementById(`deviceInfo${testNumber}`)
    } else if (type === 'doom') {
        deviceScreenElement = document.getElementById(`doomDeviceScreen${testNumber}`)
        deviceInfoElement = document.getElementById(`doomDeviceInfo${testNumber}`)
    }
    
    if (deviceScreenElement) {
        // AGGRESSIVE CLEANUP: Clear everything in the device screen element
        while (deviceScreenElement.firstChild) {
            const child = deviceScreenElement.firstChild;
            
            // If it's an image, make sure to revoke any blob URLs
            if (child.tagName === 'IMG') {
                if (child.src && child.src.startsWith('blob:')) {
                    URL.revokeObjectURL(child.src);
                }
                if (child.dataset && child.dataset.blobUrl) {
                    URL.revokeObjectURL(child.dataset.blobUrl);
                }
            }
            
            deviceScreenElement.removeChild(child);
        }
        
        // Create a new image element
        const imgElement = document.createElement("img");
        
        // Set a maximum size to prevent excessive memory usage
        imgElement.style.maxWidth = "100%";
        imgElement.style.maxHeight = "100%";
        
        // Add the image to the DOM
        deviceScreenElement.appendChild(imgElement);
        
        // Handle the image based on its format
        if (image.startsWith('blob:')) {
            // For blob URLs, just use them directly
            imgElement.src = image;
            
            // Set up cleanup when the image loads
            imgElement.onload = () => {
                // Force garbage collection
                if (window.electron.forceGarbageCollection) {
                    window.electron.forceGarbageCollection();
                }
            };
        } 
        else if (image.startsWith('data:image')) {
            // MEMORY OPTIMIZATION: Instead of converting to blob, use the data URL directly
            // This avoids creating additional objects in memory
            imgElement.src = image;
            
            // Set up cleanup when the image loads
            imgElement.onload = () => {
                // Force garbage collection
                if (window.electron.forceGarbageCollection) {
                    window.electron.forceGarbageCollection();
                }
                
                // Clear the image data from memory after a short delay
                // This helps ensure the image is displayed before we clear it
                setTimeout(() => {
                    // Request another garbage collection
                    if (window.electron.forceGarbageCollection) {
                        window.electron.forceGarbageCollection();
                    }
                }, 100);
            };
        } 
        else {
            // Regular URL
            imgElement.src = image;
        }
        
        // Update the device info with timestamp
        if (deviceInfoElement) {
            const date = new Date(timestamp);
            deviceInfoElement.textContent = `Last updated: ${date.toLocaleTimeString()}`;
        }
    }
})

// Handle Android screenshot errors
window.electron.onAndroidScreenshotError((event, data) => {
    const { testNumber, type, error } = data
    
    let deviceInfoElement
    
    if (type === 'test') {
        deviceInfoElement = document.getElementById(`deviceInfo${testNumber}`)
    } else if (type === 'doom') {
        deviceInfoElement = document.getElementById(`doomDeviceInfo${testNumber}`)
    }
    
    if (deviceInfoElement) {
        deviceInfoElement.textContent = `Screenshot error: ${error}`
        setTimeout(() => {
            deviceInfoElement.textContent = "Waiting for test to start..."
        }, 3000)
    }
})

// Function to set up toggle test buttons
function setupToggleTestButton(toggleButton, testNumber, logsContainer, statusElement, type, testName) {
    let isRunning = false
    
    toggleButton.addEventListener("click", () => {
        if (!isRunning) {
            // Start the test
            logsContainer.textContent = ""
            statusElement.textContent = `Running ${testName}...`
            statusElement.className = "status running"
            
            // Update button appearance
            toggleButton.textContent = `Stop ${testName}`
            toggleButton.classList.remove("run-button")
            toggleButton.classList.add("stop-button")
            
            // Update device info
            const deviceInfoElement = type === 'test' 
                ? document.getElementById(`deviceInfo${testNumber}`)
                : document.getElementById(`doomDeviceInfo${testNumber}`)
                
            if (deviceInfoElement) {
                deviceInfoElement.textContent = `Running ${testName}...`
            }
            
            // Send message to main process with test number
            window.electron.runTest(testNumber, type)
            isRunning = true
        } else {
            // Stop the test
            statusElement.textContent = `Stopping ${testName}...`
            window.electron.stopTest(testNumber, type)
            
            // Temporarily disable the button while stopping
            toggleButton.disabled = true
            
            // We'll re-enable and reset the button when we receive the test-stopped event
        }
    })
    
    // Handle test completion
    window.electron.onTestEnd((event, data) => {
        if (data.testNumber === testNumber && data.type === type) {
            resetTestButton()
            
            // Clean up screenshots to free memory
            cleanupScreenshots(testNumber, type);
            
            if (data.exitCode === 0) {
                statusElement.textContent = `${testName} completed successfully!`
                statusElement.className = "status success"
                
                // Update device info
                const deviceInfoElement = type === 'test' 
                    ? document.getElementById(`deviceInfo${testNumber}`)
                    : document.getElementById(`doomDeviceInfo${testNumber}`)
                    
                if (deviceInfoElement) {
                    deviceInfoElement.textContent = `${testName} completed successfully!`
                }
            } else {
                statusElement.textContent = `${testName} failed with exit code: ${data.exitCode}`
                statusElement.className = "status error"
                
                // Update device info
                const deviceInfoElement = type === 'test' 
                    ? document.getElementById(`deviceInfo${testNumber}`)
                    : document.getElementById(`doomDeviceInfo${testNumber}`)
                    
                if (deviceInfoElement) {
                    deviceInfoElement.textContent = `${testName} failed with exit code: ${data.exitCode}`
                }
            }
        }
    })
    
    // Handle test errors
    window.electron.onTestError((event, data) => {
        if (data.testNumber === testNumber && data.type === type) {
            resetTestButton()
            
            // Clean up screenshots to free memory
            cleanupScreenshots(testNumber, type);
            
            const errorLine = document.createElement("div")
            errorLine.textContent = `Error: ${data.error}`
            errorLine.style.color = "#f44336"
            logsContainer.appendChild(errorLine)
            
            statusElement.textContent = `Error running ${testName}`
            statusElement.className = "status error"
            
            // Update device info
            const deviceInfoElement = type === 'test' 
                ? document.getElementById(`deviceInfo${testNumber}`)
                : document.getElementById(`doomDeviceInfo${testNumber}`)
                
            if (deviceInfoElement) {
                deviceInfoElement.textContent = `Error running test: ${data.error}`
            }
        }
    })
    
    // Handle test stopped
    window.electron.onTestStopped((event, data) => {
        if (data.testNumber === testNumber && data.type === type) {
            resetTestButton()
            
            // Clean up screenshots to free memory
            cleanupScreenshots(testNumber, type);
            
            const stoppedLine = document.createElement("div")
            stoppedLine.textContent = `${testName} was manually stopped.`
            stoppedLine.style.color = "#ff9800"
            logsContainer.appendChild(stoppedLine)
            
            statusElement.textContent = `${testName} stopped`
            statusElement.className = "status"
            
            // Update device info
            const deviceInfoElement = type === 'test' 
                ? document.getElementById(`deviceInfo${testNumber}`)
                : document.getElementById(`doomDeviceInfo${testNumber}`)
                
            if (deviceInfoElement) {
                deviceInfoElement.textContent = `${testName} was manually stopped.`
            }
        }
    })
    
    function resetTestButton() {
        toggleButton.textContent = `Run ${testName}`
        toggleButton.classList.remove("stop-button")
        toggleButton.classList.add("run-button")
        toggleButton.disabled = false
        isRunning = false
    }
}

// Function to set up toggle Appium buttons
function setupToggleAppiumButton(toggleButton, testNumber, statusElement, logsContainer, type) {
    let isRunning = false
    
    toggleButton.addEventListener("click", () => {
        if (!isRunning) {
            // Start Appium
            console.log(`Starting Appium for ${type} ${testNumber}`)
            
            // Clear previous logs
            logsContainer.textContent = ""
            
            statusElement.textContent = `Starting Appium for ${type === 'test' ? 'test' : 'doom'} ${testNumber}...`
            statusElement.className = "status running"
            
            // Update button appearance
            toggleButton.textContent = "Stop Appium"
            toggleButton.classList.remove("appium-button")
            toggleButton.classList.add("stop-button")
            
            // Get the correct appium status element ID based on type
            let appiumStatusId;
            if (type === 'test') {
                appiumStatusId = `appiumStatus${testNumber}`;
            } else {
                appiumStatusId = `${type}AppiumStatus${testNumber}`;
            }
            
            // Update Appium status
            const appiumStatusElement = document.getElementById(appiumStatusId);
            if (appiumStatusElement) {
                appiumStatusElement.textContent = "Appium: Starting...";
                appiumStatusElement.className = "appium-status appium-running";
            } else {
                console.error(`Could not find appium status element with ID: ${appiumStatusId}`);
            }
            
            // Add initial log entry
            const startingLine = document.createElement("div")
            startingLine.textContent = `Starting Appium server for ${type} ${testNumber}...`
            logsContainer.appendChild(startingLine)
            
            // Send message to main process with test number
            window.electron.startAppium(testNumber, type)
            isRunning = true
        } else {
            // Stop Appium
            console.log(`Stopping Appium for ${type} ${testNumber}`)
            
            statusElement.textContent = `Stopping Appium for ${type === 'test' ? 'test' : 'doom'} ${testNumber}...`
            
            // Add log entry
            const stoppingLine = document.createElement("div")
            stoppingLine.textContent = `Stopping Appium server for ${type} ${testNumber}...`
            logsContainer.appendChild(stoppingLine)
            
            window.electron.stopAppium(testNumber, type)
            
            // Temporarily disable the button while stopping
            toggleButton.disabled = true
            
            // We'll re-enable and reset the button when we receive the appium-stop event
        }
    })
    
    // Handle Appium start
    window.electron.onAppiumStart((event, data) => {
        if (data.testNumber === testNumber && data.type === type) {
            console.log(`Appium started for ${type} ${testNumber} on port ${data.port}`)
            
            // Get the correct appium status element ID based on type
            let appiumStatusId;
            if (type === 'test') {
                appiumStatusId = `appiumStatus${testNumber}`;
            } else {
                appiumStatusId = `${type}AppiumStatus${testNumber}`;
            }
            
            const appiumStatusElement = document.getElementById(appiumStatusId);
            if (appiumStatusElement) {
                appiumStatusElement.textContent = `Appium: Running on port ${data.port}`;
                appiumStatusElement.className = "appium-status appium-running";
            }
            
            statusElement.textContent = `Appium server started on port ${data.port}`
            statusElement.className = "status success"
            
            // Add success log entry
            const successLine = document.createElement("div")
            successLine.textContent = `Appium server successfully started on port ${data.port}`
            successLine.style.color = "#4CAF50"
            logsContainer.appendChild(successLine)
        }
    })
    
    // Handle Appium output
    window.electron.onAppiumOutput((event, data) => {
        if (data.testNumber === testNumber && data.type === type) {
            console.log(`Appium output for ${type} ${testNumber}: ${data.output}`)
            
            // Append new output to logs container
            const outputLine = document.createElement("div")
            outputLine.textContent = data.output
            logsContainer.appendChild(outputLine)
            
            // Limit log entries to prevent memory bloat
            limitLogEntries(logsContainer);
            
            // Auto-scroll to bottom
            logsContainer.scrollTop = logsContainer.scrollHeight
        }
    })
    
    // Handle Appium stop
    window.electron.onAppiumStop((event, data) => {
        if (data.testNumber === testNumber && data.type === type) {
            console.log(`Appium stopped for ${type} ${testNumber}`)
            
            resetAppiumButton()
            
            // Get the correct appium status element ID based on type
            let appiumStatusId;
            if (type === 'test') {
                appiumStatusId = `appiumStatus${testNumber}`;
            } else {
                appiumStatusId = `${type}AppiumStatus${testNumber}`;
            }
            
            const appiumStatusElement = document.getElementById(appiumStatusId);
            if (appiumStatusElement) {
                appiumStatusElement.textContent = "Appium: Stopped";
                appiumStatusElement.className = "appium-status appium-stopped";
            }
            
            const stoppedLine = document.createElement("div")
            stoppedLine.textContent = "Appium server stopped."
            stoppedLine.style.color = "#ff9800"
            logsContainer.appendChild(stoppedLine)
            
            statusElement.textContent = "Appium server stopped"
            statusElement.className = "status"
        }
    })
    
    // Handle Appium errors
    window.electron.onAppiumError((event, data) => {
        if (data.testNumber === testNumber && data.type === type) {
            console.log(`Appium error for ${type} ${testNumber}: ${data.error}`)
            
            resetAppiumButton()
            
            // Get the correct appium status element ID based on type
            let appiumStatusId;
            if (type === 'test') {
                appiumStatusId = `appiumStatus${testNumber}`;
            } else {
                appiumStatusId = `${type}AppiumStatus${testNumber}`;
            }
            
            const appiumStatusElement = document.getElementById(appiumStatusId);
            if (appiumStatusElement) {
                appiumStatusElement.textContent = "Appium: Error";
                appiumStatusElement.className = "appium-status appium-stopped";
            }
            
            const errorLine = document.createElement("div")
            errorLine.textContent = `Error: ${data.error}`
            errorLine.style.color = "#f44336"
            logsContainer.appendChild(errorLine)
            
            statusElement.textContent = "Error starting Appium server"
            statusElement.className = "status error"
        }
    })
    
    function resetAppiumButton() {
        toggleButton.textContent = "Start Appium"
        toggleButton.classList.remove("stop-button")
        toggleButton.classList.add("appium-button")
        toggleButton.disabled = false
        isRunning = false
    }
}

// Set up each toggle button for Engage tab
setupToggleTestButton(toggleTest1Button, 1, logsContainer1, status1Element, 'test', "Test 1")
setupToggleTestButton(toggleTest2Button, 2, logsContainer2, status2Element, 'test', "Test 2")
setupToggleTestButton(toggleTest3Button, 3, logsContainer3, status3Element, 'test', "Test 3")

setupToggleAppiumButton(toggleAppium1Button, 1, status1Element, logsContainer1, 'test')
setupToggleAppiumButton(toggleAppium2Button, 2, status2Element, logsContainer2, 'test')
setupToggleAppiumButton(toggleAppium3Button, 3, status3Element, logsContainer3, 'test')

// Set up each toggle button for Doom tab
setupToggleTestButton(toggleDoom1Button, 1, doomLogsContainer1, doomStatus1Element, 'doom', "Doom 1")
setupToggleTestButton(toggleDoom2Button, 2, doomLogsContainer2, doomStatus2Element, 'doom', "Doom 2")
setupToggleTestButton(toggleDoom3Button, 3, doomLogsContainer3, doomStatus3Element, 'doom', "Doom 3")

setupToggleAppiumButton(toggleDoomAppium1Button, 1, doomStatus1Element, doomLogsContainer1, 'doom')
setupToggleAppiumButton(toggleDoomAppium2Button, 2, doomStatus2Element, doomLogsContainer2, 'doom')
setupToggleAppiumButton(toggleDoomAppium3Button, 3, doomStatus3Element, doomLogsContainer3, 'doom')

// Get the appropriate elements based on test number and type
function getElementsForTest(testNumber, type = 'test') {
    if (type === 'test') {
        switch (testNumber) {
            case 1:
                return {
                    toggleButton: toggleTest1Button,
                    toggleAppiumButton: toggleAppium1Button,
                    appiumStatusElement: appiumStatus1,
                    logsContainer: logsContainer1,
                    statusElement: status1Element,
                    deviceScreenElement: deviceScreen1,
                    deviceInfoElement: deviceInfo1
                }
            case 2:
                return {
                    toggleButton: toggleTest2Button,
                    toggleAppiumButton: toggleAppium2Button,
                    appiumStatusElement: appiumStatus2,
                    logsContainer: logsContainer2,
                    statusElement: status2Element,
                    deviceScreenElement: deviceScreen2,
                    deviceInfoElement: deviceInfo2
                }
            case 3:
                return {
                    toggleButton: toggleTest3Button,
                    toggleAppiumButton: toggleAppium3Button,
                    appiumStatusElement: appiumStatus3,
                    logsContainer: logsContainer3,
                    statusElement: status3Element,
                    deviceScreenElement: deviceScreen3,
                    deviceInfoElement: deviceInfo3
                }
            default:
                return {
                    toggleButton: toggleTest1Button,
                    toggleAppiumButton: toggleAppium1Button,
                    appiumStatusElement: appiumStatus1,
                    logsContainer: logsContainer1,
                    statusElement: status1Element,
                    deviceScreenElement: deviceScreen1,
                    deviceInfoElement: deviceInfo1
                }
            
        }
    } else if (type === 'doom') {
        switch (testNumber) {
            case 1:
                return {
                    toggleButton: toggleDoom1Button,
                    toggleAppiumButton: toggleDoomAppium1Button,
                    appiumStatusElement: doomAppiumStatus1,
                    logsContainer: doomLogsContainer1,
                    statusElement: doomStatus1Element,
                    deviceScreenElement: doomDeviceScreen1,
                    deviceInfoElement: doomDeviceInfo1
                }
            case 2:
                return {
                    toggleButton: toggleDoom2Button,
                    toggleAppiumButton: toggleDoomAppium2Button,
                    appiumStatusElement: doomAppiumStatus2,
                    logsContainer: doomLogsContainer2,
                    statusElement: doomStatus2Element,
                    deviceScreenElement: doomDeviceScreen2,
                    deviceInfoElement: doomDeviceInfo2
                }
            case 3:
                return {
                    toggleButton: toggleDoom3Button,
                    toggleAppiumButton: toggleDoomAppium3Button,
                    appiumStatusElement: doomAppiumStatus3,
                    logsContainer: doomLogsContainer3,
                    statusElement: doomStatus3Element,
                    deviceScreenElement: doomDeviceScreen3,
                    deviceInfoElement: doomDeviceInfo3
                }
            default:
                return {
                    toggleButton: toggleDoom1Button,
                    toggleAppiumButton: toggleDoomAppium1Button,
                    appiumStatusElement: doomAppiumStatus1,
                    logsContainer: doomLogsContainer1,
                    statusElement: doomStatus1Element,
                    deviceScreenElement: doomDeviceScreen1,
                    deviceInfoElement: doomDeviceInfo1
                }
        }
    }
}

// Handle test start
window.electron.onTestStart((event, data) => {
    const { testNumber, type } = data
    const { statusElement, deviceInfoElement } = getElementsForTest(testNumber, type)
    
    const testNames = {
        'test': {
            1: "Test 1",
            2: "Test 2",
            3: "Test 3"
        },
        'doom': {
            1: "Doom 1",
            2: "Doom 2",
            3: "Doom 3"
        }
    }
    
    statusElement.textContent = `Running ${testNames[type][testNumber]}...`
    statusElement.className = "status running"
    
    // Update device info
    if (deviceInfoElement) {
        deviceInfoElement.textContent = `Running ${testNames[type][testNumber]}...`
    }
})

// Handle test output (stdout/stderr)
window.electron.onTestOutput((event, data) => {
    const { testNumber, output, type } = data
    const { logsContainer } = getElementsForTest(testNumber, type)

    // Append new output to logs container
    const outputLine = document.createElement("div")
    outputLine.textContent = output
    logsContainer.appendChild(outputLine)
    
    // Limit log entries to prevent memory bloat
    limitLogEntries(logsContainer);

    // Auto-scroll to bottom
    logsContainer.scrollTop = logsContainer.scrollHeight
})

// Run memory cleanup more frequently - every 10 seconds
document.addEventListener("DOMContentLoaded", () => {
    // Run debug function to check element IDs
    debugElementIds();
    
    // Check device connections for the active tab
    const activeTab = document.querySelector('.tab.active').getAttribute('data-tab')
    
    if (activeTab === 'engage') {
        checkAllDeviceConnections('test')
    } else if (activeTab === 'doom') {
        checkAllDeviceConnections('doom')
    }
    
    // Set up a periodic check every 30 seconds for the active tab
    setInterval(() => {
        const currentActiveTab = document.querySelector('.tab.active').getAttribute('data-tab')
        
        if (currentActiveTab === 'engage') {
            checkAllDeviceConnections('test')
        } else if (currentActiveTab === 'doom') {
            checkAllDeviceConnections('doom')
        }
    }, 30000)
    
    // Run memory cleanup every 10 seconds
    setInterval(performGlobalMemoryCleanup, 10 * 1000)
})

