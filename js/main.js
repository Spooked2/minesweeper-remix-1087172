//Wait until page loads before doing funky cool things
window.addEventListener("load", init);

//Global variables

let minesweeperWindow;
let minesweeperField;
let smiley;
let resetButton;
let mineCount = 0;
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

    minesweeperWindow = document.getElementById('minesweeper_window');

    minesweeperField = document.getElementById('minesweeper_field');

    smiley = document.getElementById('smiley');

    resetButton = document.getElementById('reset_button');
    resetButton.addEventListener('click', resetMinesweeper)

    document.getElementById('minesweeper_shortcut').addEventListener('dblclick', () => {
        minesweeperWindow.show();
        setMinesweeperField();
        resetMinesweeper();
    })

    const closeButtons = document.getElementsByClassName('close');
    for (const closeButton of closeButtons) {
        closeButton.addEventListener('click', (e) => {
            e.target.parentElement.parentElement.parentElement.close();
        })
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

        //hide image
        img.style.display = 'none';

        //Then add it to the div
        tile.appendChild(img);

        //Add classes to the div for styling
        tile.classList.add('tile');

        //Add dataset attributes
        tile.dataset.x = `${i % currentDifficulty.width}`;
        if (tile.dataset.x === '0') {
            tile.dataset.x = currentDifficulty.width;
        }
        tile.dataset.y = `${Math.ceil(i / currentDifficulty.height)}`;

        tile.dataset.id = `${i}`;
        tile.dataset.mine = 'false';
        tile.dataset.flag = 'false';
        tile.dataset.question = 'false';
        tile.dataset.empty = 'false';

        //Finally add tile to minesweeper field
        minesweeperField.appendChild(tile);

    }


}

function resetMinesweeper() {
    //Clear all images
    let allTiles = document.getElementsByClassName('tile');

    for (const allTile of allTiles) {
        allTile.firstChild.src = '';
        allTile.firstChild.style.display = 'none';
        allTile.dataset.mine = 'false';
        allTile.dataset.question = 'false';
        allTile.dataset.empty = 'false';
        allTile.dataset.mine = 'false';
        allTile.classList.add('filled');
    }

    //Generate list of random tile ids
    let minePositions = [];

    for (let i = 0; i < currentDifficulty.mines; i++) {

        let number = Math.floor((Math.random() * currentDifficulty.totalTiles) + 1);

        while (minePositions.includes(number)) {
            number = Math.floor((Math.random() * currentDifficulty.totalTiles) + 1);
        }

        minePositions.push(number);

    }

    //Get each tile with an id in the minePositions array, and fill it with a mine
    let mines = [];

    for (const minePosition of minePositions) {
        let tile = document.querySelector(`div[data-id='${minePosition}']`);

        tile.dataset.mine = 'true';
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
        delete tile.dataset.surrounding;

        tile.firstChild.src = `images/${amount}.png`;
    }

}

function getSurroundingTiles(tile) {

    let surroundingTileCoordinates = [];

    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) - 1), parseInt(tile.dataset.y)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) + 1), parseInt(tile.dataset.y)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) - 1), (parseInt(tile.dataset.y) - 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10)), (parseInt(tile.dataset.y) - 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) + 1), (parseInt(tile.dataset.y) - 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) - 1), (parseInt(tile.dataset.y) + 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10)), (parseInt(tile.dataset.y) + 1)])
    surroundingTileCoordinates.push([(parseInt(tile.dataset.x, 10) + 1), (parseInt(tile.dataset.y) + 1)])

    surroundingTileCoordinates = surroundingTileCoordinates.filter(checkValidCoordinates);

    let surroundingTiles = [];

    for (const surroundingTileCoordinate of surroundingTileCoordinates) {
        const surroundingTile = document.querySelector(`div[data-x='${surroundingTileCoordinate[0]}'][data-y='${surroundingTileCoordinate[1]}']`);
        surroundingTiles.push(surroundingTile);
    }

    return surroundingTiles;

}

function checkValidCoordinates(value) {
    if (value[0] !== 0 && value[0] <= currentDifficulty.width && value[1] !== 0 && value[1] <= currentDifficulty.height) {
        return value;
    }
}