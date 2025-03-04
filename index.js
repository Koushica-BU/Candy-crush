class Game {
    constructor(handleResult) {
        this.candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
        this.board = [];
        this.rows = 9;
        this.columns = 9;
        this.score = 0;

        this.timerLeft = 60;
        this.timerDisplay = document.getElementById("timer");
        this.timerInterval;

        this.currTile = null;
        this.otherTile = null;
        this.handleResult=handleResult;
        this.loop = null;
    }

    randomCandy() {
        return this.candies[Math.floor(Math.random() * this.candies.length)];
    }

    startGame() {
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                let tile = document.createElement("img");
                tile.id = r.toString() + "-" + c.toString();
                tile.src = "./assets/" + this.randomCandy() + ".png";

                // DRAG FUNCTIONALITY
                tile.addEventListener("dragstart", this.dragStart.bind(this)); 
                tile.addEventListener("dragover", this.dragOver);
                tile.addEventListener("dragenter", this.dragEnter);
                tile.addEventListener("dragleave", this.dragLeave);
                tile.addEventListener("drop", this.dragDrop.bind(this));
                tile.addEventListener("dragend", this.dragEnd.bind(this));

                document.getElementById("board").append(tile);
                row.push(tile);
            }
            this.board.push(row);
        }
        this.loop = setInterval(() => {
            this.crushCandy();
            this.slideCandy();
            this.generateCandy();
        }, 100);
    }

    dragStart(e) {
        this.currTile = e.target;
    }

    dragOver(e) {
        e.preventDefault();
    }

    dragEnter(e) {
        e.preventDefault();
    }

    dragLeave() {}

    dragDrop(e) {
        this.otherTile= e.target;
    }

    dragEnd() {
        if (this.currTile.src.includes("blank") || this.otherTile.src.includes("blank")) {
            return;
        }

        let currCoords = this.currTile.id.split("-");
        let r = parseInt(currCoords[0]);
        let c = parseInt(currCoords[1]);

        let otherCoords = this.otherTile.id.split("-");
        let r2 = parseInt(otherCoords[0]);
        let c2 = parseInt(otherCoords[1]);

        let moveLeft = c2 == c - 1 && r == r2;
        let moveRight = c2 == c + 1 && r == r2;

        let moveUp = r2 == r - 1 && c == c2;
        let moveDown = r2 == r + 1 && c == c2;

        let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

        if (isAdjacent) {
            let currImg = this.currTile.src;
            let otherImg = this.otherTile.src;
            this.currTile.src = otherImg;
            this.otherTile.src = currImg;

            let validMove = this.checkValid();
            if (!validMove) {
                let currImg = this.currTile.src;
                let otherImg = this.otherTile.src;
                this.currTile.src = otherImg;
                this.otherTile.src = currImg;
            }
        }
    }

    crushCandy() {
        this.crushThree();
        document.getElementById("score").innerText = this.score;
        if(this.score >= 300){
            clearInterval(this.loop);
            this.handleResult();
        }
    }

    crushThree() {
        // Check rows
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 2; c++) {
                let candy1 = this.board[r][c];
                let candy2 = this.board[r][c + 1];
                let candy3 = this.board[r][c + 2];
                if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                    candy1.src = "./assets/blank.png";
                    candy2.src = "./assets/blank.png";
                    candy3.src = "./assets/blank.png";
                    this.score += 5;
                }
            }
        }

        // Check columns
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows - 2; r++) {
                let candy1 = this.board[r][c];
                let candy2 = this.board[r + 1][c];
                let candy3 = this.board[r + 2][c];
                if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                    candy1.src = "./assets/blank.png";
                    candy2.src = "./assets/blank.png";
                    candy3.src = "./assets/blank.png";
                    this.score += 5;
                }
            }
        }
    }

    checkValid() {
        // Check rows
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 2; c++) {
                let candy1 = this.board[r][c];
                let candy2 = this.board[r][c + 1];
                let candy3 = this.board[r][c + 2];
                if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                    return true;
                }
            }
        }

        // Check columns
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows - 2; r++) {
                let candy1 = this.board[r][c];
                let candy2 = this.board[r + 1][c];
                let candy3 = this.board[r + 2][c];
                if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                    return true;
                }
            }
        }

        return false;
    }

    slideCandy() {
        for (let c = 0; c < this.columns; c++) {
            let ind = this.rows - 1;
            for (let r = this.columns - 1; r >= 0; r--) {
                if (!this.board[r][c].src.includes("blank")) {
                    this.board[ind][c].src = this.board[r][c].src;
                    ind -= 1;
                }
            }

            for (let r = ind; r >= 0; r--) {
                this.board[r][c].src = "./assets/blank.png";
            }
        }
    }

    generateCandy() {
        for (let c = 0; c < this.columns; c++) {
            if (this.board[0][c].src.includes("blank")) {
                this.board[0][c].src = "./assets/" + this.randomCandy() + ".png";
            }
        }
    }

    destroy() {
        // Stop the game loop
        clearInterval(this.loop);

        // Clear the board
        document.getElementById("board").innerHTML = "";

        // Remove event listeners from tiles
        this.board.forEach(row => {
            row.forEach(tile => {
                tile.remove();
            });
        });

        // Clear references
        this.board = [];
        this.currTile = null;
        this.otherTile = null;
    }
}

class Timer {
    constructor(duration, displayElementId, onEndCallBack) {
        this.duration = duration;
        this.timerLeft = duration;
        this.displayElement = document.getElementById(displayElementId);
        this.onEndCallBack = onEndCallBack;
        this.timerInterval = null;
    }

    start() {
        this.reset(); // Reset the timer before starting
        this.timerInterval = setInterval(() => {
            if (this.timerLeft > 0) {
                this.timerLeft--;
                this.updateDisplay();
            } else {
                this.stop();
                if (this.onEndCallBack) {
                    this.onEndCallBack(this.timerLeft);
                }
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
    }

    reset() {
        this.stop();
        this.timerLeft = this.duration;
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.displayElement) {
            this.displayElement.innerText = `Timer: ${this.timerLeft}s`;
        } else {
            console.error("Timer display element not found");
        }
    }
}


let game = null; 
let gameTimer = null; 

function handleResult(timer) {
    let resDom = document.getElementById("result");
    let overlay = document.querySelector(".overlay");
    let target = 300; // Assuming the target is 300
    let score = parseInt(document.getElementById("score").innerText) || 0;

    if (score >= target) {
        gameTimer.stop();
        resDom.innerText = "Congrats! You won";
    } else if (timer <= 0) {
        resDom.innerText = "Sorry, Try again!";
    }
    overlay.style.display = "flex"; 
}

function startGame() {
    document.body.classList.replace('start-bg', 'game-bg');
    document.getElementById('startpg').classList.remove('block', 'flex');
    document.getElementById('startpg').classList.add('none');
    const gameDom = document.getElementById('game');
    gameDom.classList.replace('none', 'block');
    document.getElementById("board").style.display = "block";
    document.querySelector(".overlay").style.display = "none";

    game.startGame();
    gameTimer.start();
}

function resetGame() {
    document.body.classList.replace('game-bg', 'start-bg');
    const gameDom = document.getElementById('game');
    gameDom.classList.replace('block', 'none');
    document.getElementById('startpg').classList.remove('none');
    document.getElementById('startpg').classList.add('block','flex');
    document.querySelector(".overlay").style.display = "none";
    document.getElementById("board").style.display = "none";
    handleReset(); // Restart the game
}

function handleReset(){
    if (game) {
        game.destroy();
    }
    if(gameTimer){
        gameTimer.reset();
    }

    document.getElementById("board").innerHTML = "";
    document.getElementById("score").innerText = "0";

    game = new Game(handleResult);
    gameTimer = new Timer(60, "timer", function(timer) {
        handleResult(timer);
    });   

    const playButton = document.getElementById("startbtn");
    const resetButton = document.getElementById("reset");

    playButton.removeEventListener("click", startGame);
    resetButton.removeEventListener("click", resetGame); 

    playButton.addEventListener("click", startGame);
    resetButton.addEventListener("click", resetGame);
}

window.onload = function() {
    handleReset();
};