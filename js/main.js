//Wait until page loads before doing funky cool things
window.addEventListener("load", init);

//Global variables

let minesweeperWindow;


//Functions

function init() {

    minesweeperWindow = document.getElementById('minesweeper_window');

    document.getElementById('minesweeper_shortcut').addEventListener('dblclick', () => {
        minesweeperWindow.show()
    })

    let closeButtons = document.getElementsByClassName('close');
    for (const closeButton of closeButtons) {
        closeButton.addEventListener('click', (e) => {
            e.target.parentElement.parentElement.parentElement.close();
        })
    }

}