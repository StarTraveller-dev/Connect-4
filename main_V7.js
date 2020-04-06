/**
 * Define variables
 */
var canvas;
var ctx;
var Player; //Which players turn is it
var boardState//which places are filled
var timer;
var gameUpdateObj;
var gameState;
const states = {
    start: "start",
    end:{
        won: "won",
        tie: "tie",
    },
    game: "game",
    menu: "menu",
    instructions: "instructions"
};
var clickPos = {x:0, y:0};
var menuButtons = [];
var instructionButtons = [];
var gameButtons = [];
//gameRunning = states.game || gameUpdateObj.updating == true;

/**
 * Creates Buttons and calls Startup function.
 */
window.onload = function() {
    menuButtons[0] = new Button(350-(160/2),100,160,50, '#966d14', 'Start Game', states.game);
    menuButtons[1] = new Button(350-(160/2),170,160,50, '#966d14', 'Instructions', states.instructions);
    instructionButtons[0] = new Button(10,13,110,50, '#966d14', 'Back', states.menu);
    gameButtons[0] = new Button(350-(260/2),370,260,50, '#34ebc0', 'Back to main menu', startup);
    startup();
}

/**
 * Button class used for storing parameters.
 * @class
 */
class Button {
    constructor(xPos,yPos,width,height, fillStyle, text, navigate, shadow) {
        this.x = xPos;
        this.y = yPos;
        this.width = width;
        this.height = height;
        this.style = fillStyle;
        this.text = text;
        this.navigate = navigate;
        this.shadow = shadow || false;
    }
    onHover = function(state) {
        this.shadow = state;
    }
    draw = function() {
        //Draw shadow
        ctx.beginPath();
        if (this.shadow == true) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
            ctx.fillRect(this.x,this.y,this.width+5,this.height+5)
        }
        //Draw Box
        ctx.fillStyle = this.style;
        ctx.fillRect(this.x,this.y,this.width,this.height)
        //Draw boarder
        ctx.fillStyle = '#000000';
        ctx.strokeRect(this.x,this.y,this.width,this.height)
        ctx.stroke();
        //Draw text
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = '#000000';
        ctx.fillText(this.text, (this.width/2)+this.x, ((this.height/2)+this.y)+(20/2));
        ctx.closePath();
    }
    checkClick = function(clickPos, click) {
        if (clickPos.x >= this.x && clickPos.x <= this.x+this.width && clickPos.y >= this.y && clickPos.y <= this.y+this.height) {
            if (click || false) {
                if (this.navigate == startup)
                {
                    return startup();
                }
                gameState = this.navigate;
            }
            return true;
        } else {return false;}
    }
}

/**
 * Game Setup Function used for restarting the game.
 */
function startup() {
    boardState = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]; //which places are filled
    //boardState = [[0,2,2,1,1,1],[0,1,1,2,2,2],[0,2,2,1,1,1],[0,1,1,2,2,2],[0,2,2,1,1,1],[0,1,1,2,2,2],[0,2,2,1,1,1]]; //which places are filled
    timer = 0;
    gameState = states.menu;
    gameUpdateObj = {
    updating: false,
    xPos: null,
    yPos: null};

    canvas = document.getElementById("canvas");

    canvas.addEventListener('click', function(evt){clickHandler(evt)});
    canvas.addEventListener('mousemove', function(evt){hoverHandler(evt)});

    ctx = canvas.getContext("2d");
    Player = Math.floor(Math.random() * 2);
    Player = !!Player;
    //console.log("player:" + Player);
    main();
}

/**
 * Main Game loop that runs every 60 frames
 * @param {const} gameState - Used to determin what actions the program does
 */
function main(){
    switch (gameState) {
        case states.game:
            update();
            draw();
            break;
        case states.end.won:
            draw();
            gameOver();
            break;
        case states.end.tie:
            draw();
            gameOver();
            break;
        case states.menu:
            drawMenu();
            break;
        case states.instructions:
            drawInstructions();
            break;
    }
    requestAnimationFrame(main);
}

/**
 * Draw the game menu on screen.
 */
function drawMenu(){
    ctx.beginPath();
    ctx.fillStyle = "#8a7763";
    ctx.fillRect(0,0,800,600);
    for (elemnt in menuButtons)
        menuButtons[elemnt].draw();
    //Title Text
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = '#000000';
    ctx.textBaseline = "bottom";
    ctx.fillText("Welcome to connect 4", 350, 35);
    ctx.font = "20px Arial";
    ctx.fillText("Please Select an Option", 350, 55);
    ctx.fill();
    ctx.closePath();
}

/**
 * Draw the instructions menu on screen.
 */
function drawInstructions(){
    ctx.beginPath();
    ctx.fillStyle = "#8a7763";
    ctx.fillRect(0,0,800,600);
    for (elemnt in instructionButtons)
        instructionButtons[elemnt].draw();
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = '#000000';
    ctx.fillText("Connect 4 Instructions", 350, 35);
    ctx.font = "20px Arial";
    ctx.fillText("Each player takes their turn alternatively", 350, 105);
    ctx.fillText("The objective of the game is for each player to make a continuous", 350, 125);
    ctx.fillText("line of four of their own coloured pieces", 350, 145);
    ctx.fillText("to try and make a straight line of four own pieces", 350, 165);
    ctx.fillText("The line can be vertical, horizontal or diagonal as long as it makes 4 connected", 350, 185);
    ctx.fillText("of the same colour.", 350, 205);
    ctx.fill();
    ctx.closePath();
}

//Primary Game Functions
/**
 * Draw the game board.
 * @param {array} boardState - Used to keep track of the current board state
 */
function draw(){
    ctx.fillStyle = "#48565c";
    ctx.fillRect(0,0,800,600);

    for (var y=0; y<6; y++) {
        for (var x =0; x<7; x++) {
            ctx.beginPath();
            var col;
            switch(boardState[x][y]) {
                case 1:
                    col = "red";
                    break;
                case 2:
                    col = "blue";
                    break;
                default:
                    col = "black";
                    break;
            }
            ctx.fillStyle = col;
            ctx.arc(x*100+50, y*100+50, 50, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }
    if (timer > 0) {timer--}
}

/**
 * Display the games winner.
 */
function gameOver()
{
    ctx.beginPath();
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = '#9e7516';
    if (gameState == states.end.won) {
        ctx.fillText("The WINNER is...", 350, 205);
        ctx.fillText("Player: " + (!Player+1), 350, 255);
    }
    if (gameState == states.end.tie) {
        ctx.fillText("The game ended in a Tie!!!", 350, 225);
    }
    ctx.closePath();
    for (elemnt in gameButtons)
        gameButtons[elemnt].draw();
}

/**
 * Update boardState and call checkWin finction once the counter has finised dropping.
 */
function update(){
    if(gameUpdateObj.updating == true && timer==0) {
        var playerKey = Player+1
        boardState[gameUpdateObj.xPos][gameUpdateObj.yPos] = playerKey;   //sets the colour to be drawed on the table
        if (gameUpdateObj.yPos > 0){boardState[gameUpdateObj.xPos][gameUpdateObj.yPos-1] = 0} //sets previous back to blank
        if (boardState[gameUpdateObj.xPos][gameUpdateObj.yPos+1] != 0){
            if (checkWin())
                gameState = states.end.won;
            if (checktie())
            gameState = states.end.tie
            Player = !Player;   //Invert current Player
            gameUpdateObj.updating = false; //tells game that the drop animation is finished
        } else{
            gameUpdateObj.yPos += 1;
            timer = 10; //Sets the timer variable
        }
    }
}

/**
 * Check if either player has won by going through each possible win considtion and checking if it returns true.
 */
function checkWin(){
    var playerKey = Player+1
    const allEqual = arr => arr.every(val => val === playerKey);
    if (gameUpdateObj.xPos == null) return false;
    //Y Axis
    for (var y=0; y<6; y++) {
        if (y >= 0 && y <= 6-4){    //-4 as 4 need to be connected to win
            if (allEqual(boardState[gameUpdateObj.xPos].slice(y, y+4))) {
                return true;
            }
        }
    }
    //X Axis
    for (var x=0; x<7; x++) {
        if (x >= 0 && x <= 7-4){
            if (allEqual(boardState.map((_, columnIndex) => boardState.map(row => row[columnIndex]))[gameUpdateObj.yPos].slice(x, x+4))) {
                return true;
            }
        }
    }
    //(y, y) Axis
    for (var i=0; i<6; i++) {
        if (i >= 0 && i <= getDiagonal(boardState)[gameUpdateObj.xPos + gameUpdateObj.yPos].length-4){
            if (allEqual(getDiagonal(boardState)[gameUpdateObj.xPos + gameUpdateObj.yPos].slice(i, i+4))) {
                return true;
            }
        }
    }
    //(y, -y) Axis
    for (var i=0; i<6; i++) {
        if (i >= 0 && i <= getDiagonal(boardState, true)[(gameUpdateObj.xPos+(-2*(gameUpdateObj.xPos+1)+8)) + gameUpdateObj.yPos].length-4){
            if (allEqual(getDiagonal(boardState, true)[(gameUpdateObj.xPos+(-2*(gameUpdateObj.xPos+1)+8)) + gameUpdateObj.yPos].slice(i, i+4))) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Similar to the checkWin function although is only for checking if the game has ended in a tie.
 */
function checktie(){
    const allEqual = arr => arr.every(val => val !== 0);
    //Check for tie condition
    if (allEqual(boardState.map((_, columnIndex) => boardState.map(row => row[columnIndex]))[0].slice(0, 7))) {
        return true;
    }
    return false;
}



//Sub Functions
/**
 * Whenever a click event occures this function is called to check if any actions need to be taken. Possible actions are: checking to drop a game counter or clicking a button
 * @param {object} evt - Mouse click coordinates
 */
function clickHandler(evt){
    var mousePos = getMousePos(evt);
    var xPos = Math.floor(mousePos.x/100);
    var yPos = Math.floor(mousePos.y/100);

    if(gameUpdateObj.updating == false && yPos == 0 && boardState[xPos][0] == 0 && gameState == states.game) {
        gameUpdateObj.updating = true;
        gameUpdateObj.xPos = xPos;
        gameUpdateObj.yPos = yPos;
    }
    if (gameState == states.menu)
        for (elemnt in menuButtons)
            menuButtons[elemnt].checkClick(mousePos, true);
    if (gameState == states.instructions)
        for (elemnt in instructionButtons)
            instructionButtons[elemnt].checkClick(mousePos, true);
    if (gameState == states.end.won || gameState == states.end.tie)
        for (elemnt in gameButtons)
            gameButtons[elemnt].checkClick(mousePos, true);
}
//Hover event
/**
 * Checks for if the mouse is above the area of a button to enable/disable the drop shadow.
 * @param {object} evt - Mouse coordinates
 */
function hoverHandler(evt) {
    for (elemnt in menuButtons) {
        if (menuButtons[elemnt].checkClick(evt))
            menuButtons[elemnt].onHover(true);
        else menuButtons[elemnt].onHover(false);
    }
    for (elemnt in instructionButtons) {
        if (instructionButtons[elemnt].checkClick(evt))
            instructionButtons[elemnt].onHover(true);
        else instructionButtons[elemnt].onHover(false);
    }
    for (elemnt in gameButtons) {
        if (gameButtons[elemnt].checkClick(evt))
            gameButtons[elemnt].onHover(true);
        else gameButtons[elemnt].onHover(false);
    }
}

/**
 * Calculate the postion of the mouse relative to the canvas.
 * @param {object} evt - Mouse coordinates
 */
function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

/**
 * Get diagonal elements in array.
 * @param {array} array - Mouse coordinates
*  @param {boolean} bottomToTop - Mouse coordinates
 */
function getDiagonal(array, bottomToTop) {
    var Ylength = array.length;
    var Xlength = array[0].length;
    var maxLength = Math.max(Xlength, Ylength);
    var temp;
    var returnArray = [];
    for (var k = 0; k <= 2 * (maxLength - 1); ++k) {
        temp = [];
        for (var y = Ylength - 1; y >= 0; --y) {
            var x = k - (bottomToTop ? Ylength - y : y);
            if (x >= 0 && x < Xlength) {
                temp.push(array[y][x]);
            }
        }
        if(temp.length > 0) {
            returnArray.push(temp);
        }
    }
    return returnArray;
}
