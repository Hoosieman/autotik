import { remote } from 'webdriverio';
import { assert } from 'chai';
import { comments } from './comments.js'; // Import the comments array
import { followMe } from './follow-for-follow.js'; // Import the follow array

const capabilities = {
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'amuthan-test-device2',
    'appium:appPackage': 'com.zhiliaoapp.musically',
    'appium:appActivity': 'com.ss.android.ugc.aweme.main.MainActivity',
    'appium:platformName': 'Android',
    'appium:noReset': true,
    "appium:udid": "R5CXC0LY81P",
    'appium:newCommandTimeout': 120,
    'appium:waitForIdleTimeout': 0, // Disable waiting for idle
    'appium:skipUnlock': true, // Speeds up element finding
    'appium:disableAndroidWatchers': true
};

const wdOpts = {
    hostname: '127.0.0.1',
    port: 4725,
    logLevel: 'info',
    waitforTimeout: 30000,
    capabilities,
};

class ScrollHelper {
    constructor(driver) {
        this.driver = driver;
    }

    // Random swipe down (scroll down)
    async randomSwipeUp() {
        const size = await this.driver.getWindowRect();
    
        // Starting point is at the horizontal center of the screen and 80% down the height, but with slight offset to avoid share button
        const startScrollX = size.width / 2;
        const startScrollY = size.height * 0.75;  // Start slightly higher to avoid bottom buttons (adjusted for safety)
    
        // Random end point between 40% to 60% of the screen height (shorter distance)
        const randomEndScrollY = Math.min(size.height * (0.3 + Math.random() * 0.1), size.height * 0.40); // Reduced randomization for shorter swipe
    
        // Perform the swipe action (swiping upwards)
        await this.driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startScrollX, y: startScrollY },  // Move to the start point near the bottom immediately (no pause here)
                { type: 'pointerDown', button: 0 },  // Press down without holding
                { type: 'pointerMove', duration: 400, x: startScrollX, y: randomEndScrollY },  // Move upwards to the random end point (faster swipe)
                { type: 'pointerUp', button: 0 }  // Lift up the finger
            ]
        }]);
    }




    async nextPostSwipe() {
        const size = await this.driver.getWindowRect();
        
        // Starting point is at the horizontal center of the screen and 85% down the height, but with slight offset to avoid the share button
        const startScrollX = size.width / 2;
        const startScrollY = size.height * 0.85;  // Start slightly higher to avoid bottom buttons (adjusted for safety)
        
        // Random end point between 10% to 20% of the screen height (longer distance)
        const randomEndScrollY = Math.min(size.height * (0.1 + Math.random() * 0.1), size.height * 0.2);  // Swipe further (upwards to 20% of screen height)
        
        // Perform the swipe action (swiping upwards)
        await this.driver.performActions([{
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startScrollX, y: startScrollY },  // Move to the start point near the bottom immediately (no pause here)
                { type: 'pointerDown', button: 0 },  // Press down without holding
                { type: 'pointerMove', duration: 300, x: startScrollX, y: randomEndScrollY },  // Move upwards to the new end point (faster swipe with a shorter duration)
                { type: 'pointerUp', button: 0 }  // Lift up the finger
            ]
        }]);
    }
    
    
    
}

class HeartClickHelper {
    constructor(driver) {
        this.driver = driver;
    }

    // Click a random number (1-3) of heart icons from the first 3
    
    async clickRandomHearts()
    {
      // Find all heart icons on the screen
      const heartIconsSelector = '//android.widget.ImageView[@resource-id="com.zhiliaoapp.musically:id/i3y"]'
      const heartIcons = await this.driver.$$(heartIconsSelector)
    
      console.log(`Found ${heartIcons.length} heart icons on the screen`)
    
      // Create a copy of the array to shuffle
      const shuffledHeartIcons = [...heartIcons]
    
      // Shuffle the array to click them in a random order
      for (let i = shuffledHeartIcons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffledHeartIcons[i], shuffledHeartIcons[j]] = [shuffledHeartIcons[j], shuffledHeartIcons[i]]
      }
    
      // Click on each heart icon with random delays
      for (let i = 0; i < shuffledHeartIcons.length; i++) {
        const heartIcon = shuffledHeartIcons[i]
    
        // Wait for the heart icon to be displayed
        await heartIcon.waitForDisplayed({ timeout: 2000 })
    
        // Click the heart icon
        await heartIcon.click()
        console.log(`Clicked heart icon ${i + 1} of ${shuffledHeartIcons.length}`)
    
        // Only add delay if it's not the last heart
        if (i < shuffledHeartIcons.length - 1) {
          // Generate a random delay between 0.3 and 0.6 seconds
            const randomWaitTime = Math.random() * 0.3 + 0.3;  // Random time between 0.3 and 0.6 seconds
            console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
            await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds
          
        }
      }
    }



    async logMemoryUsage() {
        const used = process.memoryUsage();
        console.log(`Memory usage: RSS: ${Math.round(used.rss / 1024 / 1024)}MB, Heap: ${Math.round(used.heapUsed / 1024 / 1024)}/${Math.round(used.heapTotal / 1024 / 1024)}MB`);
    }
    
    
}






class ShareClickHelper {
    constructor(driver) {
        this.driver = driver;
    }

    // Click the share button, wait a random time (1-2 seconds), and then click the copy link button
    async clickShareAndCopyLink() {
        // Find the share button and click it
        const shareButtonXPath = '//android.widget.Button[contains(@content-desc, "Share video.") and contains(@content-desc, "shares")]';
        const shareButton = await this.driver.$(shareButtonXPath);
        await shareButton.waitForDisplayed({ timeout: 5000 });
        await shareButton.click();
        console.log("Clicked the share button.");


        const randomWaitTime = Math.random() + 1;  // Random time between 1 and 2 seconds, including decimals
        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds
        


        // Find the copy link button and click it
        const copyLinkButtonXPath = `//android.widget.Button[@content-desc="Copy link"]`; // Change this XPath to match your app
        const copyLinkButton = await this.driver.$(copyLinkButtonXPath);
        await copyLinkButton.waitForDisplayed({ timeout: 5000 });
        await copyLinkButton.click();
        console.log("Clicked the copy link button.");
    }
}


class SaveClickHelper {
    constructor(driver) {
        this.driver = driver;
    }

    // Click the share button, wait a random time (1-2 seconds), and then click the copy link button
    async clickSaveButton() {
        // Find the share button and click it
        const saveButtonXPath = `//android.widget.Button[@content-desc="Add or remove this video from Favorites."]`; // Change this XPath to match your app
        const saveButton = await this.driver.$(saveButtonXPath);
        await saveButton.waitForDisplayed({ timeout: 5000 });
        await saveButton.click();
        console.log("Clicked the save button.");

        const randomWaitTime = Math.random() + 1;  // Random time between 1 and 2 seconds, including decimals
        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds


    }

    async clickLikeButton() {
        // Find the share button and click it
        const likeButtonXPath = `//android.widget.ImageView[@content-desc="Like"]`; // Change this XPath to match your app
        const likeButton = await this.driver.$(likeButtonXPath);
        await likeButton.waitForDisplayed({ timeout: 5000 });
        await likeButton.click();
        console.log("Clicked the like button.");

    }
}






class FollowClickHelper {
    constructor(driver) {
        this.driver = driver;
    }

    // Click the share button, wait a random time (1-2 seconds), and then click the copy link button
    async clickFollowButton() {
        // Find the share button and click it
        const followButtonXPath = `//android.widget.ImageView[@resource-id="com.zhiliaoapp.musically:id/fol"]`; // Change this XPath to match your app
        const followButton = await this.driver.$(followButtonXPath);
        await followButton.waitForDisplayed({ timeout: 5000 });
        await followButton.click();
        console.log("Clicked the follow button.");

        const randomWaitTime = Math.random() + 1;  // Random time between 1 and 2 seconds, including decimals
        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds


    }


    async randomFollow() {
        // Find all heart icons on the screen
        const profileButtonsSelector = '(//android.widget.ImageView[@resource-id="com.zhiliaoapp.musically:id/hxc"])';
        const profileIcons = await this.driver.$$(profileButtonsSelector);
    
        console.log(`Found ${profileIcons.length} heart icons on the screen`);
    
        // Ensure there are profile icons to click
        if (profileIcons.length > 0) {
            // Pick a random index from the list of profile icons
            const randomIndex = Math.floor(Math.random() * profileIcons.length);
            const randomIcon = profileIcons[randomIndex];
    
            // Click the randomly selected profile icon
            await randomIcon.click();
            console.log('Clicked a random profile icon');

            const randomWaitTime = Math.random() * 1 + 2;  // Random time between 2 and 3 seconds
            console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
            await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds


            try {
                //followers count
                const followersCountXPath = `//android.widget.TextView[@resource-id="com.zhiliaoapp.musically:id/mms"]`;
                const followers = await this.driver.$(followersCountXPath);
                await followers.waitForDisplayed({ timeout: 5000 });
                const followersCount = await followers.getText();
                console.log('Followers count: ', followersCount);

                //following count
                const followingCountXPath = `//android.widget.TextView[@resource-id="com.zhiliaoapp.musically:id/mqe"]`;
                const following = await this.driver.$(followingCountXPath);
                await following.waitForDisplayed({ timeout: 5000 });
                const followingCount = await following.getText();
                console.log('Following count: ', followingCount);

                if (followersCount < followingCount) {
                    console.log('Following more than followers, FOLLOW');

                    //click follow button
                    const followButtonXPath = `//android.widget.TextView[@resource-id="com.zhiliaoapp.musically:id/dek" and @text="Follow"]`; // Change this XPath to match your app
                    const followButton = await this.driver.$(followButtonXPath);
                    await followButton.waitForDisplayed({ timeout: 2000 });
                    await followButton.click();

                    const randomWaitTime = Math.random() * 1 + 2;  // Random time between 2 and 3 seconds
                    console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                    await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

                    //click message button
                    const messageButtonXPath = `//android.widget.TextView[@resource-id="com.zhiliaoapp.musically:id/ddy"]`; // Change this XPath to match your app
                    const messageButton = await this.driver.$(messageButtonXPath);
                    await messageButton.waitForDisplayed({ timeout: 3000 });
                    const buttonState = await messageButton.getText();

                    console.log('Button State: ', buttonState);

                    if (buttonState == ' Message') {
                        await messageButton.click();

                        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

                        //input message
                        const messageBar = await this.driver.$('//android.widget.EditText[@text="Message..."]');
                        await messageBar.waitForDisplayed({ timeout: 5000 });
                        await messageBar.click();
                        await messageBar.sendKeys(["follow back please"]);

                        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

                        const sendButton = await this.driver.$('//android.widget.ImageView[@content-desc="Send"]');
                        await sendButton.click();

                        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

                        const previousButton = await this.driver.$('//android.widget.ImageView[@content-desc="Back"]');
                        await previousButton.click();
                        await previousButton.click();

                        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

                    } else {
                        console.log('Follow Requested, DON\'T MESSAGE');
                    }
                    
                    

                    const backButton = await this.driver.$('//android.widget.LinearLayout[@resource-id="com.zhiliaoapp.musically:id/kih"]/android.widget.ImageView');
                    await backButton.waitForDisplayed({ timeout: 5000 });
                    await backButton.click();

                    console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                    await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds
                } else {
                    console.log('Following less than followers, DON\'T FOLLOW');

                    const backButton = await this.driver.$('//android.widget.LinearLayout[@resource-id="com.zhiliaoapp.musically:id/kih"]/android.widget.ImageView');
                    await backButton.waitForDisplayed({ timeout: 5000 });
                    await backButton.click();

                    console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                    await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds
       
                }



                
            } 
            
            catch (error) {
                try {
                    // Check if the closeButton is displayed
                    const closeButton = await this.driver.$('//android.widget.ImageView[@content-desc="Close"]');
                    if (await closeButton.isDisplayed()) {
                        await closeButton.click();
                    } else {
                        // If closeButton is not displayed, check if backButton is displayed
                        const backButton = await this.driver.$('//android.widget.LinearLayout[@resource-id="com.zhiliaoapp.musically:id/kih"]/android.widget.ImageView');
                        if (await backButton.isDisplayed()) {
                            await backButton.click();
                        }
                    }
                } catch (clickError) {
                    // Handle any errors that occur during the click actions
                    console.error("Error during clicking: ", clickError);
                }
            }
            

        } else {
            console.log('No profile icons found to click');
        }
    }






    async followForFollow() {
        

        try {
            //checks if the creator tag is displayed, if not it will proceed replying (do NOT want to reply to creator)
            const creatorTagXPath = `(//android.widget.TextView[@resource-id="com.zhiliaoapp.musically:id/ctr" and @text="Creator"])`;
            const creatorTag = await this.driver.$(creatorTagXPath);
            await creatorTag.waitForDisplayed({ timeout: 1000 });

        } catch (error) {


            //reply to comments (that are not the creators comment)
            const replyButtonsSelector = '//android.widget.TextView[@resource-id="com.zhiliaoapp.musically:id/d4n"]';
            const replyIcons = await this.driver.$$(replyButtonsSelector);
        
            console.log(`Found ${replyIcons.length} heart icons on the screen`);
        
            // Ensure there are reply icons to click
            if (replyIcons.length > 0) {
                // Pick a random index from the list of profile icons
                const randomIndex = Math.floor(Math.random() * replyIcons.length);
                const randomIcon = replyIcons[randomIndex];
        
                // Click the randomly selected reply icon
                await randomIcon.click();
                console.log('Clicked a random reply icon');

                const randomWaitTime = Math.random() * 1 + 3;  // Random time between 2 and 3 seconds
                console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds


                // Step 1: Pick a random comment from the array
                const randomNumber = Math.floor(Math.random() * followMe.length);
                const randomComment = followMe[randomNumber];




                await randomIcon.sendKeys([randomComment]);

                console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

                const postButton = await this.driver.$('//android.widget.Button[@content-desc="Post comment"]');
                await postButton.click();

                console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
                await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

            

            } else {
                console.log('No reply icons found to click');
            }

        }

        
    }


    

   
    
}






class RandomTimeHelper {
    constructor(driver) {
        this.driver = driver;
    }

    // Click the share button, wait a random time (1-2 seconds), and then click the copy link button
    async longRandomTime() {
       
        const randomWaitTime = Math.random() * 3 + 5;  // Random time between 5 and 8 seconds
        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds


    }

    async mediumRandomTime() {
        
        const randomWaitTime = Math.random() + 1;  // Random time between 1 and 2 seconds, including decimals
        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

    }

    async shortRandomTime() {
        
        const randomWaitTime = Math.random() * 0.3 + 0.3;  // Random time between 0.3 and 0.6 seconds
        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds

    }
}


class CommentClickHelper {
    constructor(driver) {
        this.driver = driver;
    }


    async isThereNoComments() {

        // Find the share button and click it
        const noCommentsXPath = `//android.widget.Button[( @content-desc="Read or add comments. 0 comments" or @content-desc="Read or add comments. 1 comments" or @content-desc="Read or add comments. 2 comments" )]`;
        const noCommentsButton = await this.driver.$(noCommentsXPath);
        await noCommentsButton.waitForDisplayed({ timeout: 1000 });

        console.log('There are NO, comments');
       

        
    }

    // Click the share button, wait a random time (1-2 seconds), and then click the copy link button
    async clickCommentButton() {
        // Step 2: Find the element that opens the comment section (using XPath)
        const element = await this.driver.$('//android.widget.FrameLayout[@resource-id="com.zhiliaoapp.musically:id/crl"]');
            
        // Step 3: Wait for the element to be displayed (the button that opens the comments)
        await element.waitForDisplayed({ timeout: 5000 });
    
        // Step 4: Click on the element to open the comment section
        await element.click();

    }

    async typeComment() {
        // Uses array from comments.js
        
    
        // Step 1: Pick a random comment from the array
        const randomIndex = Math.floor(Math.random() * comments.length);
        const randomComment = comments[randomIndex];
    
        // Step 2: Find the comment bar
        const commentBar = await this.driver.$('//android.widget.FrameLayout[@resource-id="com.zhiliaoapp.musically:id/f18"]');
        
        // Ensure the comment bar is displayed and clickable
        await commentBar.waitForDisplayed({ timeout: 5000 });
        await commentBar.click();
    
        // Step 3: Use sendKeys to type the random comment into the comment bar
        // Make sure sendKeys is passed with the correct type (string)
        await commentBar.sendKeys([randomComment]);


        const randomWaitTime = Math.random() * 1 + 2;  // Random time between 2 and 3 seconds
        console.log(`Waiting for ${randomWaitTime.toFixed(3)} seconds.`);
        await this.driver.pause(randomWaitTime * 1000);  // Convert to milliseconds




        const submitButton = await this.driver.$('//android.widget.Button[@content-desc="Post comment"]');
        await submitButton.click();
    }



    
    

}







describe('Engagement', function() {
    
    this.timeout(86400000); // 24 hours in milliseconds

    let driver;
    let scrollHelper;
    let heartClickHelper;
    let shareClickHelper;
    let saveClickHelper;
    let commentClickHelper;
    let randomTimeHelper;
    let followClickHelper;

    before(async function() {
        driver = await remote(wdOpts);
        scrollHelper = new ScrollHelper(driver);
        heartClickHelper = new HeartClickHelper(driver);
        shareClickHelper = new ShareClickHelper(driver);
        saveClickHelper = new SaveClickHelper(driver);
        commentClickHelper = new CommentClickHelper(driver);
        randomTimeHelper = new RandomTimeHelper(driver);
        followClickHelper = new FollowClickHelper(driver);
    });

    after(async function() {
        await driver.deleteSession();
    });

    it('Open comment section, swipe through comments and like them randomly', async function() {
        let repeatTest = true;

        // Repeat the process until you decide to stop (based on a condition or flag)
        while (repeatTest) {


            if (global.gc) global.gc();

            

            await randomTimeHelper.longRandomTime();

            await heartClickHelper.logMemoryUsage();


            try {
                await randomTimeHelper.mediumRandomTime();
                await commentClickHelper.isThereNoComments();
                await scrollHelper.nextPostSwipe();
                continue;
            } catch (error) {
                await randomTimeHelper.mediumRandomTime();
            }

            try { 
                await randomTimeHelper.mediumRandomTime();
                await shareClickHelper.clickShareAndCopyLink();
            } catch (error) {
                await randomTimeHelper.mediumRandomTime();
                await scrollHelper.nextPostSwipe();
                continue;
            }

            try { 
                await randomTimeHelper.mediumRandomTime();
                await saveClickHelper.clickSaveButton();
            } catch (error) {
                await randomTimeHelper.mediumRandomTime();
                await scrollHelper.nextPostSwipe();
                continue;
            }


            try {
                await randomTimeHelper.mediumRandomTime();
                await saveClickHelper.clickLikeButton();
            } catch (error) {
                await randomTimeHelper.mediumRandomTime();
                await scrollHelper.nextPostSwipe();
                continue;
            }

            

            /* try {

                await randomTimeHelper.mediumRandomTime();
                await followClickHelper.clickFollowButton();
            } catch (error) {
                await randomTimeHelper.mediumRandomTime();
                await scrollHelper.nextPostSwipe();
            } */

            
            try {
                await randomTimeHelper.mediumRandomTime();
                await commentClickHelper.clickCommentButton();
                //await commentClickHelper.typeComment();
            } catch (error) {
                await randomTimeHelper.mediumRandomTime();
                await scrollHelper.nextPostSwipe();
                continue;
            }

            
        
            const targetTextElement = await driver.$('(//android.view.ViewGroup[@resource-id="com.zhiliaoapp.musically:id/d2v"])[2]//android.widget.Button[@resource-id="com.zhiliaoapp.musically:id/title"]');

            let reachedEnd = false;  // Flag to indicate if we've reached the end of the list

            for (let swipeCount = 0; swipeCount < 1000; swipeCount++) {
                try {
                    // Get the current text before the swipe
                    const currentText = await targetTextElement.getText();
                    console.log(currentText); // Log the current text before swipe

                    // Swipe up randomly
                    await scrollHelper.randomSwipeUp();

                    await driver.pause(2000);


                    // Get the current text after the swipe
                    const afterText = await targetTextElement.getText();
                    console.log(afterText); // Log the after text

                    // Check if the text has changed
                    if (currentText === afterText) {
                        console.log('Reached the end of the list, no change in text.');
                        const exitComments = await driver.$('//android.widget.ImageView[@content-desc="Close"]')
                        await exitComments.click();
                        await randomTimeHelper.mediumRandomTime();
                        await scrollHelper.nextPostSwipe();
                        reachedEnd = true;  // Set flag to true indicating we've reached the end
                        break;  // Exit the loop if the text hasn't changed (i.e., reached the end)
                    }

                    
                    // Click a random number of heart icons (1 to 3) after each swipe
                    await heartClickHelper.clickRandomHearts();

                    // Follow a person each iteration
                    //await followClickHelper.randomFollow();

                    await followClickHelper.followForFollow();

                    // Possibly message the followed person to follow back
                } catch (error) {
                    console.error(`Error occurred during swipe iteration ${swipeCount}: ${error.message}`);
                    // Continue to the next iteration even if an error occurs
                }

                // If we've reached the end, exit the loop
                if (reachedEnd) {
                    break;
                }
            }

            // Check if we need to repeat the test
            // For example, after reaching the end, decide if we should start over or exit
            if (reachedEnd) {
                console.log('Reached end, restarting the test...');
                // Optionally add a delay before restarting
            } else {
                // Set to false to stop the loop after a certain condition is met
                repeatTest = false;
            }
        }
    });
});





