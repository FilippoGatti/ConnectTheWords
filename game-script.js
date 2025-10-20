// CONSTANTS
const EASY = 7;
const MEDIUM = 5;
const HARD = 3;
// VARIABLES
var wordSelected = [];
var wordWaitingList = [];
var newEngBtns = [];
var newItaBtns = [];
var btnClicked = [];
var points = 0;
var score = document.getElementById("score-display");
var difficultySelection = document.getElementById("difficulty-selection");
var difficulty = document.getElementById("difficulty-sel");
var gameContainer = document.getElementById("game-container");
var engColumn = document.getElementById("english-column");
var itaColumn = document.getElementById("italian-column");
var gameOverMsg = document.getElementById("final-msg");

window.addEventListener("load", () => { populateGame(EASY) });

difficulty.addEventListener("change", (c) => {
    // reset all variables
    wordSelected.length = 0;
    wordWaitingList.length = 0;
    newEngBtns.length = 0;
    newItaBtns.length = 0;
    btnClicked.length = 0;
    points = 0;
    score.textContent = "";
    
    if(difficulty.value == "Easy") {
        populateGame(EASY)
    } else if (difficulty.value == "Medium") {
        populateGame(MEDIUM)
    } else if (difficulty.value == "Hard") {
        populateGame(HARD)
    }  //END IF
});

function populateGame(val) {

    randomlySelection(wordSelected, val);

    buttonCreator(wordSelected);

    engColumn.replaceChildren(...newEngBtns);
    itaColumn.replaceChildren(...newItaBtns);

    // remove elements from every array
    newEngBtns.length = 0;
    newItaBtns.length = 0;
    wordSelected.length = 0;

};

// select a random number (times) of elments from an array (where)
function randomlySelection(where, times) {

    for (var i=0; i<times; i++) {

        var newWordSelected = data[Math.floor(Math.random()*data.length)];
        if (newWordSelected !== wordSelected) { where.push(newWordSelected); };
        
    }  // END FOR

};

function buttonCreator(where) {
    // create buttons for english and italian words
    where.forEach((w) => {

        var engBtn = document.createElement("button")
        engBtn.innerHTML = w[1];
        engBtn.setAttribute("nid", w[0]);
        engBtn.addEventListener("click", () => checkClicked(engBtn));
        newEngBtns.push(engBtn); 

        var itaBtn = document.createElement("button")
        itaBtn.innerHTML = w[2];
        itaBtn.setAttribute("nid", w[0]);
        itaBtn.addEventListener("click", () => checkClicked(itaBtn));
        newItaBtns.push(itaBtn);

    });  // END FOR

    // shuffle buttons
    shuffle(newEngBtns);
    shuffle(newItaBtns);

};

// Fisher-Yates shuffle
function shuffle(array) {
    for (let i = array.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    };
    return array;
};

function checkClicked(btn) {
    btn.setAttribute("checked", "yes");
    btnClicked.push(btn);

    if (btnClicked.length == 2) {
        // check if buttons selected are of the same column
        if (btnClicked[0].parentNode.id == btnClicked[1].parentNode.id) {
            // if yes deselect the first one
            btnClicked[0].setAttribute("checked", "no");
            btnClicked.splice(0, 1);
        } else {
            // check if the selection is correct
            if (btnClicked[0].getAttribute("nid") == btnClicked[1].getAttribute("nid")) {
                // give points
                points += 1;
                score.textContent = `Score: ${points}`;
                //  remove the selected buttons
                btnClicked.forEach((el) => { el.remove() });
                // restore array
                btnClicked.length = 0;
                // prepare (if needed) add new words
                if (wordWaitingList.length == 0) { addWords() };
                addBtn();
            } else {
                gameOver();
            };  // END INNER IF - Check word
        };  // END INNER IF - Check column
    };  // END IF
};

function addWords() {
    // select three new words
    randomlySelection(wordWaitingList, 3);
    // create buttons
    buttonCreator(wordWaitingList);
};

function addBtn() {
    // append new button
    engColumn.appendChild(newEngBtns[0]);
    itaColumn.appendChild(newItaBtns[0]);
    // remove that button from array
    newEngBtns.shift();
    newItaBtns.shift();
    // remove elements from waiting list
    wordWaitingList.pop();
};

function gameOver() {
    // hide all the elements not useful
    score.textContent = "";
    difficultySelection.style.display = "none";
    gameContainer.style.display = "none";

    // text message for end game
    var lostText = `

        Game Over!

        ${btnClicked[0].innerText} is not ${btnClicked[1].innerText}

        Final Score: ${points}

        Refresh the page to play again
    `;
    
    // display text message for end game
    gameOverMsg.style.display = "block";
    gameOverMsg.innerText = lostText;
};
