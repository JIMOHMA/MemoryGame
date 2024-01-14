var emojiPairs = new Map();
function init() {

    const emojiType = ["😂", "😥", "🍔", "🥨", "🚒", "✈", "💘", "🐋"];
    
    let counter = 0;
    let counter2 = 1;
    emojiType.forEach(emoji => {
        emojiPairs.set(counter, emoji);
        emojiPairs.set(counter2, emoji)
        counter =  counter + 2;
        counter2 = counter2 + 2;
    })
    // console.log(`emojiPairs is ${emojiPairs}`);
}
    
function getUniqueNumbers(min, max, count) {
    let uniqueNumbers =  new Set()
    while (uniqueNumbers.size < count) {
        let number = Math.floor(Math.random() * (max - min + 1)) + min;
        uniqueNumbers.add(number)
    }
    return Array.from(uniqueNumbers);
}

// setup function for populating the board
function setUp() {
    init() // sets up the map for the grid
    // console.log(`emojiPairs is ${emojiPairs}`);
    // console.log("Here now");
    var grid = document.getElementsByClassName("emj");
    grid = [...grid]
    const gridSize = grid.length;
    // console.log(`type of grid is ${typeof(grid)}`);
    
    let uniqueInfo = getUniqueNumbers(0, 15, gridSize);
    let counter = 0;
    // populate the grid the random emojis
    grid.map((item) => {
        item.textContent = emojiPairs.get(uniqueInfo[counter]);
        item.disabled = false;
        counter++;
    });
    console.log(emojiPairs);

    // call function to add the onClick event listener
    addClickEventToButton();

    // hide/disable the load button is pressed
    document.getElementById("load").hidden = true;
    fadeOutEmojis(3000); // fadeDelay by 3 seconds
}

// add event Listener to the clicked event on every button
function addClickEventToButton() {
    let start = 0;
    let end = 15;
    
    while (start <= end) {        
        var buttonID = `button${start}`
        // add onclick to button
        const emojiButton = document.getElementById(buttonID);
        emojiButton.addEventListener("click", mouseDown);
        start++;
    }
}

// *************************************************
// variables for tracking progress/state of the game
var lastEmojiClicked = "";
var lastEmojiID = "";
var secondEmojiID = "";
var clickCounter = 0;
var completeCounter = 0;
var complete_percentage = 0;
var selectedEmojis = [];
// *************************************************

// Always return true unless emoji is already selected
function newSelection(thisEmojiID, thatEmojiID) {
    if (selectedEmojis.includes(thisEmojiID) && selectedEmojis.includes(thatEmojiID)) {
        return false;
    }
    return true;
}

// function to execute when a button is clicked
function mouseDown(event)
{
    console.log(selectedEmojis);
    // get element of clicked button by ID
    const lastClickedButton = document.getElementById(this.id);
    console.log(lastClickedButton);
    
    if (clickCounter === 0) {
        startStopwatch(); // Start the timer on the first click
        // console.log(`button clicked is: ${this.innerText}`);
        // console.log(`button clicked ID is: ${this.id}`);
        // this is the first click, update counter by 1
        clickCounter++;
        console.log(`click conuter: ${clickCounter}`);
        // lastEmojiClicked = this.innerText; // value of prev button clicked
        // lastEmojiID = this.id;
        
        // lastEmojiID = getEmojiID(this.id);
        lastEmojiID = getEmojiID(this.id);
        lastEmojiClicked = document.getElementById(lastEmojiID).innerText; // value of prev button clicked
        
        console.log(`button clicked ID is: ${this.id}`);
        console.log(`emoji ID is: ${lastEmojiID}`);
        console.log(`emoji is: ${lastEmojiClicked}`);
        
        // hideButtonContent(lastEmojiID);
        revealButtonContent(lastEmojiID);
    } else {
        // only case should be the second click
        // check for a matching pair of emojis
        secondEmojiID = getEmojiID(this.id);
        console.log(`1st emoji ID is: ${lastEmojiID}`);
        console.log(`2nd emoji ID is: ${secondEmojiID}`);
        if ((lastEmojiClicked === this.innerText) && (lastEmojiID !== secondEmojiID) && newSelection(lastEmojiID, secondEmojiID)) {
            revealButtonContent(secondEmojiID); // reveal the emoji of the second emoji clicked
            
            // track both emojis clicked
            selectedEmojis.push(lastEmojiID);
            selectedEmojis.push(secondEmojiID);

            // we have a matching poir, so unhide both emojis forever
            unhideLastClickedButton2(lastEmojiID);
            unhideLastClickedButton2(secondEmojiID); // hides the second button clicked
            updateCompleteStatus();
            reset();
            // TODO: post congratulations message
            
            if (complete_percentage === 100){
                // stop the stopwatch when game is 100% complete
                stopStopwatch();

                // unhide the restart button to re-initialize the grid
                document.getElementById("restart").hidden = false;
            }
        }else {
            secondEmojiID = getEmojiID(this.id)
            revealButtonContent(secondEmojiID); // reveal the emoji of the second button clicked
            setTimeout(() => {
                // 1. If the pair clicked were already selected, we leave them revealed
                // 2. Only conceal the non-matching pair clicked which were never selected previously
                if (newSelection(lastEmojiID, secondEmojiID)) {
                    concealButtonContent(lastEmojiID);
                    concealButtonContent(secondEmojiID);
                }
                reset();
            }, 150); // shows the second emoji for 150 milliseconds before hiding it 
        }

    }
}

// resets the global tracking variables
function reset() {
    lastEmojiID = "";
    secondEmojiID = "";
    clickCounter = 0;
}

// reset game to initial state
function reInitialize() {
    lastEmojiID = "";
    secondEmojiID = "";
    clickCounter = 0;
    completeCounter = 0;
    complete_percentage = 0;
    selectedEmojis = [];
    document.getElementById("scoreValue").innerText = complete_percentage.toString();

    var grid = document.getElementsByClassName("emj");
    grid = [...grid]
    grid.map((emojiButton) => {
        console.log(`emojiButton is ${emojiButton}`);
        emojiButton.disabled = false; // this is useful when the game restarts
    })
}

// only updates upon a successful match of two emojis 
function updateCompleteStatus() {
    const progressScore = document.getElementById("scoreValue");
    progressScore.innerText = calculateCompletePercentage().toString();
}

function calculateCompletePercentage() {
    // we only call this function upon a successful match
    // hence two emojis need to be hidden on the grid
    completeCounter += 2;
    complete_percentage = (completeCounter/16) * 100 // divide by 16 cause we have 16 emojis in total
    return complete_percentage // divide by 16 cause we have 16 emojis in total
}

// button emoji values should be already stored in the 
// lastEmojiClicked variable
// using hidden property
function hideButtonContent(buttonID) {
    const buttoninfo = document.getElementById(buttonID);
    buttoninfo.innerText = '';
    buttoninfo.disabled = true;
    // TODO: Make the button unclickable (Important)
}

// using hidden property
// function unhideLastClickedButton(buttonID) {
//     // unhide the last clicked emoji since we don't have a match
//     const buttoninfo = document.getElementById(buttonID);
//     buttoninfo.innerText = lastEmojiClicked;
//     buttoninfo.disabled = false;
// }

// using hidden property
function unhideLastClickedButton2(buttonID) {
    // unhide the last clicked emoji since we don't have a match
    const buttoninfo = document.getElementById(buttonID);
    buttoninfo.disabled = true;
}

function doNothing() {
    console.log(`${this.id} does nothing`);
}

// using opacity
function revealButtonContent(buttonID) {
    const buttoninfo = document.getElementById(buttonID);
    buttoninfo.style.opacity = "1";
    buttoninfo.style.transition = 'opacity 0.3s ease-in'
    buttoninfo.disabled = true; // not working for some reason
}

// using opacity
function concealButtonContent(buttonID) {
    const buttoninfo = document.getElementById(buttonID);
    buttoninfo.style.opacity = "0";
    buttoninfo.style.transition = 'opacity 0.5s ease-in-out'
    buttoninfo.disabled = false; // make button clickable for future selections
}

// function to call upon completion and restart of the game
function restart() {

    // wipe out the grid and wait 1 second
    let grid = document.getElementsByClassName("emj");
    grid = [...grid];
    grid.map((emoji) => {
        emoji.innerText = "";
    });

    setTimeout(() => {
        // resets the game to its initial stage
        // re-add setup to the page only if the game is done
        // hence 100% progression or justs a hard reset....quitter
        reInitialize(); 
        setUp();
        // stopStopwatch();
        resetStopwatch();
        setBestTime();  // update the page with the best time on restart of game.
    }, 1000); // waits 1 second before repopulating the grid again.

    document.getElementById("restart").hidden = true;
}

// TODO: Rewrite using React
// Should be fairly easy from here

// Bugs TODO: 
// 1. Fix incorrect progression score upon click of a
// completed emoji pair DONE ✅
// 2. Either disabled the button or do something else
// 3. Add a stopwatch timer to the page DONE ✅
// Helper Link: https://www.educative.io/answers/how-to-create-a-stopwatch-in-javascript

var startTime; // to keep track of the start time
var stopwatchInterval; // to keep track of the interval
var elapsedPausedTime = 0; // to keep track of the elapsed time while stopped
var gameTime = 0;
var gameTimeObject = {
    "milliseconds": 0,
    "formatted": "00:00:00",
};

function startStopwatch() {
    if (!stopwatchInterval) {
        startTime = new Date().getTime() - elapsedPausedTime; // get the starting time by subtracting the elapsed paused time from the current time
        stopwatchInterval = setInterval(updateStopwatch, 1000); // update every second
    }
}

function stopStopwatch() {
    clearInterval(stopwatchInterval); // stop the interval
    // elapsedPausedTime = new Date().getTime() - startTime; // calculate elapsed paused time
    stopwatchInterval = null; // reset the interval variable

    // record game time for the completed game
    setGameTime();
    // update the localStorage for the best time
    updateBestTime();
}

function resetStopwatch() {
    // stopStopwatch(); // stop the interval
    elapsedPausedTime = 0; // reset the elapsed paused time variable
    document.getElementById("stopwatch").innerHTML = "00:00:00"; // reset the display
}

function updateStopwatch() {
    var currentTime = new Date().getTime(); // get current time in milliseconds
    var elapsedTime = currentTime - startTime; // calculate elapsed time in milliseconds
    var seconds = Math.floor(elapsedTime / 1000) % 60; // calculate seconds
    var minutes = Math.floor(elapsedTime / 1000 / 60) % 60; // calculate minutes
    var hours = Math.floor(elapsedTime / 1000 / 60 / 60); // calculate hours
    var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); // format display time
    document.getElementById("stopwatch").innerHTML = displayTime; // update the display

    gameTime = elapsedTime; // return the last calculated time
}

function pad(number) {
    // add a leading zero if the number is less than 10
    return (number < 10 ? "0" : "") + number;
}

function setGameTime() {
    var seconds = Math.floor(gameTime / 1000) % 60; // calculate seconds
    var minutes = Math.floor(gameTime / 1000 / 60) % 60; // calculate minutes
    var hours = Math.floor(gameTime / 1000 / 60 / 60); // calculate hours
    var displayTime = pad(hours) + ":" + pad(minutes) + ":" + pad(seconds); // format display time
    document.getElementById("current-time").innerText = displayTime; // update the display

    // to be stored in locaStorage
    gameTimeObject = [ gameTime, displayTime ]
}

// updates the page on restart of game with the best time
function setBestTime() {
    const bestTimeElement = document.getElementById("best-time");
    bestTimeElement.innerText = JSON.parse(localStorage.getItem("currentBestTime"))[1];
}

// update local storage with the overall best time
function updateBestTime() {
    // before updating the localStorage, compare with the 
    // previously stored record
    try {
        let storage = JSON.parse(localStorage.getItem("currentBestTime"));
        if (storage[0] <= gameTimeObject[0]) {
            return
        } else {
            localStorage.setItem("currentBestTime", JSON.stringify(gameTimeObject));
        }
    } catch (error) {
        localStorage.setItem("currentBestTime", JSON.stringify(gameTimeObject));
    }
}

function fadeOutEmojis(fadeDelay) {
    // const emojiGrid = document.querySelectorAll(".buttonObj .emj");
    let emojiGrid = document.querySelectorAll(".emj");
    emojiGrid = [...emojiGrid];
    // change opaacity on each emoji button after n seconds with a transition effect
    setTimeout(() => {
        emojiGrid.map((emoji) => {
            emoji.style.opacity = "0"; // blur every emoji after 5 seconds
            emoji.style.transition = 'opacity 5s ease-in-out';
        })
      }, fadeDelay);
}

// reproduces the ID of the emojis from the button IDs
function getEmojiID(buttonID) {
    let temp = buttonID.split("button");
    return `emoji${temp[1]}`
}