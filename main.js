const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");
cvs.height = 500;
cvs.width = 800;

let frame = 0;
const opponents = [];
var bgPosition = [];
var isSame = -1;
var trickScore = 0;
var keyno = -1;
var score = 0;
var gameOver = false;
var gameWon = false;
var gameStart = false;
var keydraw = false;
var canCollide = true;


var player1 = new Image();
var opponent1 = new Image();
var gameOverImage = new Image();
var gameWonImage = new Image();
var ball = new Image();
var trick = new Audio();
var fans = new Audio();
var success = new Image();
var toStart = new Image();
var opponent2 = new Image();
var key = new Image();
const bg = new Image();

toStart.src = "images/start.png";
success.src = "images/success.png";
fans.src = "sounds/fans.mp3";
trick.src = "sounds/trick.mp3";
ball.src = "images/ball.png";
opponent1.src = "images/opponentsprite.png";
player1.src = "images/playersprite1.png";
gameOverImage.src = "images/gameover.png";
gameWonImage.src = "images/gamewon.png";
opponent2.src = "images/tackler.png";
bg.src = "images/bg.png"

bgPosition[0] = {
    x: 0,
    y: 0
};

var player = {
    x: 50,
    y: 300,
    width: 100,
    height: 150,
    frameX: 0,
    maxframe: 9,
    minframe: 0,
    spritewidth: 120,
    spriteheight: 150,
    ballx: 0,
    update() {
        if (player.y < 300) {
            player.y += 5;

            if (player.y > 350) {
                player.y = 350;
            }
        }
        if (frame % 5 == 0) {
            if (this.frameX < this.maxframe) {
                this.frameX++;
            } else this.frameX = this.minframe;
        }
        if (frame % 50 > 0) {
            if (frame % 100 > 50) {
                this.ballx++;

            } else this.ballx--;
        }
    },
    draw() {
        ctx.drawImage(player1, this.frameX * this.spritewidth, 0, this.spritewidth, this.spriteheight, player.x, player.y, this.width, this.height);
        ctx.drawImage(ball, this.x + this.width + 5 + this.ballx, this.y + this.height - 35);
    }
}


//oyuncu bastıgı tuşların kontrolü
document.addEventListener("keydown", function (e) {
    if (player.y == 300) {
        if (e.key == "ArrowUp" || e.key == " ") {
            jump(e);
        }
    }
    if (e.key == "b" && !gameStart) {
        gameStart = true;
        fans.play();
    }
    if (keydraw && gameStart) {
        if (e.key == "a" && keyno == 0) {
            trickScore++;
            keyCreate();
            if (trickScore == 3) {
                canCollide = false;
                keydraw = false;
                trickScore = 0;
                trick.play();
            }
        } else if (e.key == "s" && keyno == 1) {
            trickScore++;
            keyCreate();
            if (trickScore == 3) {
                canCollide = false;
                keydraw = false;
                trickScore = 0;
                trick.play();
            }
        } else if (e.key == "d" && keyno == 2) {
            trickScore++;
            keyCreate();
            if (trickScore == 3) {
                canCollide = false;
                keydraw = false;
                trickScore = 0;
                trick.play();
            }
        } else if (e.key == "w" && keyno == 3) {
            trickScore++;
            keyCreate();
            if (trickScore == 3) {
                canCollide = false;
                keydraw = false;
                trickScore = 0;
                trick.play();
            }

        } else gameOver = true;
    }
})

//zıplama fonksiyonu
function jump(e) {
    player.y -= 10;
    // ballPosition.y -= 8;
    if (player.y <= 100) {
        return 0;
    }
    requestAnimationFrame(jump);
}

//hareketli arkaplan
function backgorund() {
    for (let i = 0; i < bgPosition.length; i++) {
        ctx.drawImage(bg, bgPosition[i].x, bgPosition[i].y);
        bgPosition[i].x -= 2;
        if (bgPosition[i].x == -2) {
            bgPosition.push({
                x: cvs.width,
                y: 0
            });
        }
    }
}

//rakip oyuncuların özellikleri
class opponent {
    constructor(y, height) {
        this.x = cvs.width;
        this.y = y;
        this.width = 100;
        this.height = height;
        this.speed = 5;
        this.frameX = 0;
        this.maxframe = 9;
        this.minframe = 0;
        this.spritewidth = 120;
        this.spriteheight = 150;
    }
    update() {

        this.x -= this.speed;
        if (frame % 5 == 0) {
            if (this.frameX < this.maxframe) {
                this.frameX++;
            } else this.frameX = this.minframe;
        }

    }
    draw() {
        if (this.height == 150) {
            ctx.drawImage(opponent1, this.frameX * this.spritewidth, 0, this.spritewidth, this.spriteheight, this.x, this.y, this.width, this.height);
        } else

            ctx.drawImage(opponent2, this.x, this.y, 120, 60);
    }
}
//rakip oyuncuların oluşturulması
function createOpponents() {
    for (let i = 0; i < opponents.length; i++) {
        opponents[i].update();
        opponents[i].draw();
        if (collision(player, opponents[i])) {
            gameOver = true;


        } //oluşturulan oyuncu eğer ekranın dışına çıkmışsa silmek
        if (opponents[i].x < -100) {
            opponents.splice(i, 1);
            i--;
            score++;
            if (score == 10) {
                gameWon = true;

            }
        }
    }
    if (frame % 250 == 0) {
        if (Math.floor(Math.random() * 2) == 0) {
            opponents.push(new opponent(380, 50));
            canCollide = true;

        } else {
            opponents.push(new opponent(300, 150));
            keyCreate();
            canCollide = true;
            keydraw = true;
        }
    }
}

//oyuncuların çarpışmasının kontrolü
function collision(first, second) {
    if (canCollide) {
        if (!(first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)) {
            return true;
        }
    }
}
//çalım atılması için basılması gereken tuşlar
function keyCreate() {
    keyno = Math.floor(Math.random() * 4);
    while (isSame == keyno)
        keyno = Math.floor(Math.random() * 4);
    isSame = keyno;
    if (keyno == 0) {
        key.src = "images/a.png";
    } else if (keyno == 1) {
        key.src = "images/s.png";
    } else if (keyno == 2) {
        key.src = "images/d.png";
    } else {
        key.src = "images/w.png";
    }
}

function draw() {

    if (gameStart) {
        backgorund();
        createOpponents();
        player.draw();
        player.update();
        if (keydraw) {
            ctx.drawImage(key, 370, 60);
        }
        frame++;
        if (!gameOver && !gameWon)
            requestAnimationFrame(draw);
        if (gameOver) ctx.drawImage(gameOverImage, 0, 0);
        if (gameWon) ctx.drawImage(gameWonImage, 0, 0);
    } else {
        ctx.drawImage(toStart, 0, 0);
        requestAnimationFrame(draw);
    }
}

draw();