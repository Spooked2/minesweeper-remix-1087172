//Wait until page loads before doing funky cool things
window.addEventListener("load", init);

//Global variables

let noteDialog;
let noteShortcut;

let mysteryDialog
let mysteryButton;
let mystery;

let minesweeperWindow;
let minesweeperSettings;
let minesweeperSettingsForm;
let minesweeperField;

let bestTimes;
let smiley;
let resetButton;
let nextButton;
let nextButtonImage;

let timer = null;
let time = 0;
let timer1;
let timer10;
let timer100;

let remainingFlags = 10;
let count1;
let count10;
let count100;

let arcadeStreak = 0;
let streak1;
let streak10;
let streak100;

let gameOver;
let firstClick = true;

let arcadeUnlock = false;
let arcadeMode = false;
let arcadeLoss = false;
let arcadeWin = false;

let surroundingEmptyTiles = [];

const difficultySettings = {
    beginner: {
        width: 8,
        height: 8,
        mines: 10,
        totalTiles: 64
    },
    intermediate: {
        width: 16,
        height: 16,
        mines: 40,
        totalTiles: 256
    },
    expert: {
        width: 30,
        height: 16,
        mines: 99,
        totalTiles: 480
    },
    arcade: {
        width: 8,
        height: 8,
        mines: 5,
        totalTiles: 64
    }
};

let currentDifficulty = difficultySettings.beginner;


//Functions

function init() {

    noteDialog = document.getElementById('noteDialog');

    noteShortcut = document.getElementById('text_file');
    noteShortcut.addEventListener('dblclick', () => {
        noteDialog.show();
    })

    let closeNote = document.getElementById('closeNote');
    closeNote.addEventListener('click', () => {
        noteDialog.close();
    })

    mystery = document.getElementById('mystery');

    mysteryDialog = document.getElementById('mystery_dialog');
    mysteryDialog.addEventListener('click', (e) => {
        if (e.target.tagName === 'DIALOG') {
            mysteryDialog.close();
            mystery.src = '';
        }
    })

    mysteryButton = document.getElementById('mystery_button');
    mysteryButton.addEventListener('click', () => {
        mysteryDialog.showModal();
        mystery.src = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&amp;modestbranding=1&amp;showinfo=0&amp;start=0';
    })

    let mysteryClose = document.getElementById('mystery_close');
    mysteryClose.addEventListener('click', () => {
        mysteryDialog.close();
        mystery.src = '';
    })

    minesweeperField = document.getElementById('minesweeper_field');
    minesweeperField.addEventListener('click', minesweeperClickHandler);
    minesweeperField.addEventListener('contextmenu', flagHandler);
    minesweeperField.addEventListener('mousedown', smileyHandler);
    minesweeperField.addEventListener('mouseup', smileyHandler);

    //Get the timer images
    timer1 = document.getElementById('timer_1');
    timer10 = document.getElementById('timer_10');
    timer100 = document.getElementById('timer_100');

    //Get the flag counter images
    count1 = document.getElementById('count_1');
    count10 = document.getElementById('count_10');
    count100 = document.getElementById('count_100');

    //Get the streak counter images
    streak1 = document.getElementById('streak_1');
    streak10 = document.getElementById('streak_10');
    streak100 = document.getElementById('streak_100');

    //Get the smiley image
    smiley = document.getElementById('smiley');

    //Get the reset button and make it reset minesweeper if clicked
    resetButton = document.getElementById('reset_button');
    resetButton.addEventListener('click', resetMinesweeper);
    resetButton.addEventListener('mousedown', buttonPresser);
    resetButton.addEventListener('mouseup', buttonPresser);

    //Get the next button and make it handle increasing the arcade difficulty
    nextButton = document.getElementById('next_button');
    nextButton.addEventListener('click', arcadeDifficultyHandler);
    nextButton.addEventListener('mousedown', buttonPresser);
    nextButton.addEventListener('mouseup', buttonPresser);

    //Get the next button image for styling later
    nextButtonImage = document.getElementById('next_button_image');

    minesweeperWindow = document.getElementById('minesweeper_window');
    minesweeperWindow.addEventListener('click', (e) => {
        if (e.target !== minesweeperSettings && e.target !== minesweeperSettingsDropdownButton && e.target.tagName !== 'U') {
            minesweeperSettings.style.display = 'none';
        }
    })

    //Get the minesweeper shortcut and make it open the minesweeper window if double-clicked
    document.getElementById('minesweeper_shortcut').addEventListener('dblclick', (e) => {
        minesweeperWindow.show();
        setMinesweeperField();
        resetMinesweeper(e);
    })

    minesweeperSettings = document.getElementById('minesweeper_settings_dropdown');

    const minesweeperSettingsDropdownButton = document.getElementById('minesweeper_settings_dropdown_button');
    minesweeperSettingsDropdownButton.addEventListener('click', () => {
        minesweeperSettings.style.display = 'block';
    })

    let minesweeperClose = document.getElementById('minesweeper_close');
    minesweeperClose.addEventListener('click', () => {
        minesweeperWindow.close();
    })

    minesweeperSettingsForm = document.getElementById('minesweeper_settings');
    minesweeperSettingsForm.addEventListener('click', settingsClickHandler);
    minesweeperSettingsForm.addEventListener('change', changeDifficulty);

    bestTimes = document.getElementById('bestTimeDialog');

    //Get all images to prevent dragging
    let allImages = document.getElementsByTagName('img');
    for (let image of allImages) {
        image.draggable = false;
    }


}

function setMinesweeperField() {

    //Clear out any previously made tiles
    minesweeperField.innerHTML = '';

    //Set the size of the minesweeper field based on selected difficulty

    minesweeperField.style.gridTemplateColumns = `repeat(${currentDifficulty.width}, 32px)`;
    minesweeperField.style.gridTemplateRows = `repeat(${currentDifficulty.height}, 32px)`;

    //Create tiles with coordinates
    for (let i = 1; i <= (currentDifficulty.totalTiles); i++) {

        //Create the div
        let tile = document.createElement('div');

        //Create an image element
        let img = document.createElement('img');
        img.draggable = false;

        //Then add it to the div
        tile.appendChild(img);

        //Add classes to the div for styling
        tile.classList.add('tile');
        tile.classList.add('filled');

        //Add dataset attributes
        tile.dataset.x = `${i % currentDifficulty.width}`;
        if (tile.dataset.x === '0') {
            tile.dataset.x = currentDifficulty.width;
        }
        tile.dataset.y = `${Math.ceil(i / currentDifficulty.width)}`;

        tile.dataset.id = `${i}`;
        tile.dataset.mine = 'false';
        tile.dataset.flag = 'false';
        tile.dataset.question = 'false';
        tile.dataset.empty = 'false';

        //Finally add tile to minesweeper field
        minesweeperField.appendChild(tile);

    }

}

function resetMinesweeper(e) {

    if (e.target.id === 'reset_button' && arcadeMode || e.target.id === 'smiley' && arcadeMode) {
        arcadeLoss = true;
        arcadeWin = false;
    }

    //Set gameOver to false
    gameOver = false;

    //Reset the timer
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    //Reset time if it's not arcade mode
    if (!arcadeMode || arcadeLoss) {
        time = 0;
        updateTimer();
    }

    if (arcadeLoss) {

        //Reset the streak
        arcadeStreak = 0
        updateStreak();

        //Reset the difficulty scale
        currentDifficulty.width = 8;
        currentDifficulty.height = 8;
        currentDifficulty.mines = 5;
        currentDifficulty.totalTiles = 64;

        setMinesweeperField();
        arcadeLoss = false;
    }

    //Revive the smiley or steal their sunglasses
    smiley.src = 'images/smiley_happy.png';

    //Reset next button
    if (arcadeMode) {
        nextButtonImage.src = 'images/question_mark.png'
    }

    //Reset remaining flags
    remainingFlags = currentDifficulty.mines;

    //Reset flag counter
    updateFlagDisplay();

    //Reset all dataset attributes
    let allTiles = document.getElementsByClassName('tile');

    for (const allTile of allTiles) {

        //Clear images
        allTile.firstChild.src = '';

        //Reset dataset of tile
        allTile.dataset.mine = 'false';
        allTile.dataset.flag = 'false';
        allTile.dataset.question = 'false';
        allTile.dataset.empty = 'true';
        allTile.dataset.mine = 'false';
        delete allTile.dataset.surrounding;

        //Reset class list
        allTile.className = 'tile filled';
    }

    firstClick = true;

}

function setMines(startTile) {

    //Get the surrounding tiles of the starting tile
    let startTiles = getSurroundingTiles(startTile);
    startTiles.push(startTile);

    //Get the ids of the surrounding tiles
    let startTileIds = [];
    for (const tile of startTiles) {
        startTileIds.push(parseInt(tile.dataset.id, 10))
    }

    //Generate list of random tile ids
    let minePositions = [];

    for (let i = 0; i < currentDifficulty.mines; i++) {

        //Generate a random number within limit of total tiles
        let number = Math.floor((Math.random() * currentDifficulty.totalTiles) + 1);

        //Keep trying again if the number is a duplicate or is in the startTileIds array
        while (minePositions.includes(number) || startTileIds.includes(number)) {
            number = Math.floor((Math.random() * currentDifficulty.totalTiles) + 1);
        }

        minePositions.push(number);

    }

    //Get each tile with an id in the minePositions array, and fill it with a mine
    let mines = [];

    for (const minePosition of minePositions) {
        let tile = document.querySelector(`div[data-id='${minePosition}']`);

        //Set the dataset of the tile
        tile.dataset.mine = 'true';
        tile.dataset.empty = 'false';
        //Set the mine image
        tile.firstChild.src = 'images/mine.png';

        mines.push(tile);
    }

    for (const mine of mines) {
        let surroundingTiles = getSurroundingTiles(mine);

        for (const surroundingTile of surroundingTiles) {

            if (surroundingTile.dataset.mine !== 'true') {

                surroundingTile.dataset.surrounding += 'I';

            }

        }
    }

    //Add proper number image to all tiles
    let tiles = document.querySelectorAll(`div[data-surrounding]`);

    for (const tile of tiles) {
        let amount = tile.dataset.surrounding.length - 9;
        tile.dataset.surrounding = `${amount}`;
        tile.dataset.empty = 'false';

        tile.firstChild.src = `images/${amount}.png`;
    }
}

function getSurroundingTiles(tile) {

    let surroundingTileCoordinates = [];

    //Left and right of the tile
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) - 1), parseInt(tile.dataset.y, 10)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) + 1), parseInt(tile.dataset.y, 10)])

    //The three tiles above the tile
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) - 1), (parseInt(tile.dataset.y, 10) - 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10)), (parseInt(tile.dataset.y, 10) - 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) + 1), (parseInt(tile.dataset.y, 10) - 1)])

    //The three tiles under the tile
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) - 1), (parseInt(tile.dataset.y, 10) + 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10)), (parseInt(tile.dataset.y, 10) + 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) + 1), (parseInt(tile.dataset.y, 10) + 1)])

    //Remove any coordinates that aren't valid, such as any coordinate equal to 0 or anything exceeding the height and width
    surroundingTileCoordinates = surroundingTileCoordinates.filter(checkValidCoordinates);

    //Fetch all tiles based on the valid coordinates and return them
    let surroundingTiles = [];

    for (const surroundingTileCoordinate of surroundingTileCoordinates) {
        const surroundingTile = document.querySelector(`div[data-x='${surroundingTileCoordinate[0]}'][data-y='${surroundingTileCoordinate[1]}']`);
        surroundingTiles.push(surroundingTile);
    }

    return surroundingTiles;

}

//A function made to filter the surroundingTileCoordinates array in the function getSurroundingTiles
//Does not return the value if either coordinate is 0 or above the width or height
function checkValidCoordinates(value) {
    if (value[0] !== 0 && value[0] <= currentDifficulty.width && value[1] !== 0 && value[1] <= currentDifficulty.height) {
        return value;
    }
}

//Click handler for the minesweeper field
function minesweeperClickHandler(e) {

    if (firstClick) {
        let startTile = e.target;
        //Set mines (set mines)
        //Sets the mines (the mines)
        setMines(startTile);
        firstClick = false;
    }

    //Don't do anything if it's gameOver
    if (gameOver) {
        return;
    }

    if (!timer) {
        timer = setInterval(updateTimer, 1000);
    }

    //Don't do anything if the field itself is clicked
    if (e.target.classList.contains('minesweeper_field')) {
        return;
    }

    //Get the correct element if an image was clicked
    let tile;
    if (e.target.tagName === 'IMG') {
        tile = e.target.parentElement;
    } else {
        tile = e.target;
    }

    //Don't do anything if the tile is flagged or questioned
    if (tile.dataset.flag === 'true' || tile.dataset.question === 'true') {
        return;
    }

    //If the tile is filled, dig it up and don't do anything else
    if (tile.classList.contains('filled')) {
        dig(tile);

        if (tile.dataset.empty === 'true') {
            digSurrounding(tile);
        }

        return;
    }

    //Don't do anything else if the tile doesn't have the dataset-surrounding
    if (!tile.dataset.surrounding) {
        return;
    }

    //If the clicked thing is a number and there's an amount of flags surrounding it equal to that number, dig the surrounding tiles
    let surroundingTiles = getSurroundingTiles(tile);
    let flags = 0;

    for (const surroundingTile of surroundingTiles) {
        if (surroundingTile.dataset.flag === 'true') {
            flags++
        }
    }

    if (parseInt(tile.dataset.surrounding) === flags) {
        digSurrounding(tile);
    }


}

//Handler for right-clicking in the minesweeper field
function flagHandler(e) {
    e.preventDefault();

    //Don't do anything if it's gameOver
    if (gameOver) {
        return;
    }

    //Get the tile element even if the image was clicked
    let tile;
    if (e.target.tagName === 'IMG') {

        tile = e.target.parentElement;

    } else {

        tile = e.target;

    }

    //Don't do anything if the tile is not filled
    if (!tile.classList.contains('filled')) {
        return;
    }

    //If there's no flag or question mark, add a flag and check if all mines are flagged
    if (tile.dataset.flag === 'false' && tile.dataset.question === 'false') {

        //If no more flags remain, don't place a new one
        if (remainingFlags <= 0) {
            return;
        }

        tile.dataset.flag = 'true';

        tile.firstChild.src = 'images/flag.png';

        remainingFlags--;

        updateFlagDisplay();

        checkWin();

    }

    //Else if there's a flag, replace it with a question mark
    else if (tile.dataset.flag === 'true') {

        //Get a flag back
        tile.dataset.flag = 'false';
        remainingFlags++;

        updateFlagDisplay();

        tile.dataset.question = 'true';

        tile.firstChild.src = 'images/question_mark.png';
    }

    //If it's a question, remove both and put the correct image back
    else {

        tile.dataset.question = 'false';

        //Set the correct image
        if (tile.dataset.mine === 'true') {

            tile.firstChild.src = 'images/mine.png';

        } else if (tile.dataset.surrounding) {

            tile.firstChild.src = `images/${parseInt(tile.dataset.surrounding)}.png`;

        } else {

            tile.firstChild.src = '';

        }


    }

}

//Function for digging up a tile
function dig(tile) {

    //Remove the 'filled' class
    tile.classList.remove('filled');

    if (tile.dataset.mine === 'true') {

        gameOver = true;

        tile.classList.add('exploded');

        clearInterval(timer);
        timer = null;

        smiley.src = 'images/smiley_dead.png';

        showAllMines();

        if (arcadeMode) {
            arcadeLoss = true;
            nextButtonImage.src = 'images/wrong_flag.png';
        }

        return;
    }

    checkWin();

}

//Removes the filled class from all mines and marks any wrong flags with an x
function showAllMines() {

    //Get all mine tiles that don't have a flag on them
    let mines = document.querySelectorAll(`div[data-mine='true'][data-flag='false']`);

    //Remove the 'filled' class and set the correct image for all mines
    for (const mine of mines) {
        mine.classList.remove('filled');

        mine.firstChild.src = 'images/mine.png'
    }

    //Get all incorrect flags and replace them with an x
    let incorrectFlags = document.querySelectorAll(`div[data-mine='false'][data-flag='true']`);

    for (const incorrectFlag of incorrectFlags) {
        incorrectFlag.firstChild.src = 'images/wrong_flag.png'
    }

}

//Digs all the surrounding tiles and keeps going until all connected empty tiles are also dug up
function digSurrounding(tile) {
    //Get the surrounding tiles of input tile
    let surroundingTiles = getSurroundingTiles(tile);

    //Loop through all surrounding tiles and dig them up
    for (const surroundingTile of surroundingTiles) {

        if (!surroundingTile.classList.contains('filled') || surroundingTile.dataset.flag === 'true' || surroundingTile.dataset.question === 'true') {
            continue;
        }

        dig(surroundingTile);

        //If the tile was empty, add it to the global list
        if (surroundingTile.dataset.empty === 'true') {
            surroundingEmptyTiles.push(surroundingTile);
        }

    }

    if (surroundingEmptyTiles.length === 0) {
        return
    }

    let nextTile = surroundingEmptyTiles.shift();

    digSurrounding(nextTile);

}

function checkWin() {

    if (remainingFlags > 0) {
        return;
    }

    if (document.querySelectorAll(`.filled[data-flag='false']`).length > 0) {
        return;
    }

    gameOver = true;

    clearInterval(timer);
    timer = null;

    smiley.src = 'images/smiley_win.png';

    if (arcadeMode) {
        arcadeStreak++;
        updateStreak();
        arcadeWin = true;
        nextButtonImage.src = 'images/next.png';
    }

    if (!arcadeUnlock) {
        document.getElementById('arcade').classList.remove('hidden');
        document.querySelector('label.hidden').classList.remove('hidden');
        arcadeUnlock = true;
    }

}

function smileyHandler(e) {
    if (gameOver) {
        return;
    }

    if (e.type === 'mousedown') {
        smiley.src = 'images/smiley_click.png';
    } else {
        smiley.src = 'images/smiley_happy.png';
    }

}

function updateTimer() {

    if (timer) {
        time++;
    }

    if (time <= 999) {

        timer100.src = `images/timer_${(Math.floor(time / 100)) % 10}.png`;

        timer10.src = `images/timer_${(Math.floor(time / 10)) % 10}.png`;

        timer1.src = `images/timer_${time % 10}.png`;

    }

}

function updateFlagDisplay() {

    count100.src = `images/timer_${(Math.floor(remainingFlags / 100)) % 10}.png`;

    count10.src = `images/timer_${(Math.floor(remainingFlags / 10)) % 10}.png`;

    count1.src = `images/timer_${remainingFlags % 10}.png`;

}

function updateStreak() {

    streak100.src = `images/timer_${(Math.floor(arcadeStreak / 100)) % 10}.png`;

    streak10.src = `images/timer_${(Math.floor(arcadeStreak / 10)) % 10}.png`;

    streak1.src = `images/timer_${arcadeStreak % 10}.png`;

}

function settingsClickHandler(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
        return;
    }

    switch (e.target.id) {
        case "reset_minesweeper":
            resetMinesweeper(e);
            break;

        case "best_times":
            bestTimes.show();
            break;

        case "exit_minesweeper":
            minesweeperWindow.close();
            break;
    }

}

function changeDifficulty(e) {

    switch (e.target.value) {

        case 'beginner':
            currentDifficulty = difficultySettings.beginner;
            break;

        case 'intermediate':
            currentDifficulty = difficultySettings.intermediate;
            break;

        case 'expert':
            currentDifficulty = difficultySettings.expert;
            break;

        case 'arcade':
            currentDifficulty = difficultySettings.arcade;
            break;
    }

    arcadeMode = e.target.value === 'arcade';

    if (arcadeMode) {
        document.getElementById('arcade_stats').style.display = 'flex';
        arcadeLoss = true;
        resetMinesweeper(e);
        return;
    } else {
        document.getElementById('arcade_stats').style.display = 'none';
    }

    setMinesweeperField();
    resetMinesweeper(e);

}

function arcadeDifficultyHandler(e) {

    if (arcadeLoss || !arcadeWin) {
        return;
    }

    arcadeWin = false;

    if (currentDifficulty.mines < 512) {
        currentDifficulty.mines += 2;

        if (currentDifficulty.mines > 512) {
            currentDifficulty.mines = 512;
        }

    }

    let fieldChange = false;

    if (arcadeStreak > 0) {

        if ((arcadeStreak % 2) === 0 && currentDifficulty.width < 32) {
            currentDifficulty.width++;
            fieldChange = true;
        }

        if ((arcadeStreak % 4) === 0 && currentDifficulty.height < 32) {
            currentDifficulty.height++;
            fieldChange = true;

        }

    }

    if (fieldChange) {
        currentDifficulty.totalTiles = currentDifficulty.width * currentDifficulty.height;
        setMinesweeperField();
    }

    resetMinesweeper(e);

}

function buttonPresser(e) {

    let button;
    if (e.target.tagName === 'IMG') {
        button = e.target.parentElement;
    } else {
        button = e.target;
    }

    button.classList.toggle('extrude');
    button.classList.toggle('indent');

}