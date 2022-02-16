let myGamePiece;
let myPrincess;
let myObstacle;
let mySecondObstacle;
let myBackground;

let myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 720;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function (e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function (e) {
      myGameArea.keys[e.keyCode] = false;
    });
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  }
};

function startGame() {
  myGameArea.start();
  myGamePiece = new component("image", 43, 70, "./assets/img/finn-L1.png", 10, 430);
  myPrincess = new component("image", 70, 70, "./assets/img/princess.png", 550, 0);
  myObstacle = new component("image", 100, 35, "./assets/img/gumdrops.png", 250, 375);
  mySecondObstacle = new component("image", 100, 35, "./assets/img/gumdrops.png", 450, 275);
  myBackground = new component("image", 2000, 500, "./assets/img/bg.jpg", 0, 0);
  $(".col-md-8" ).append( myGameArea.canvas);
};

function component(type, width, height, color, x, y) {
  this.type = type;
  if (type === "image" || type === "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.jump = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0.3;
  this.gravitySpeed= 0;
  this.bounce = 0;
  this.update = function(){
    let ctx = myGameArea.context;
    if (type === "image" || type === "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      if (type === "background") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function() {
    if (this.type === "background") {
      if (this.x === -(this.width)) {
        this.x = 0;
      }
    }
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    if (this.jump > 0) {
      this.jump -= 0.5;
    }
    this.y += this.speedY + this.jump + this.gravitySpeed;
    this.hitBottom();
    this.hitTop();
    this.hitLeft();
    this.hitRight();
    
  }
  this.hitBottom = function() {
    let rockbottom = myGameArea.canvas.height - this.height;
    if (this.y > rockbottom) {
      this.y = rockbottom
      this.gravitySpeed = 0;
      this.jump = 0;
    }
  } 
  this.hitTop = function() {
    let rocktop = 0;
    if (this.y < rocktop) {
      this.y = rocktop
    }
  }
  this.hitLeft = function() {
    let rockLeft = 0;
    if (this.x < rockLeft) {
      this.x = rockLeft;
    }
  }
  this.hitRight = function() {
    let rockRight = myGameArea.canvas.width - this.height;
    if (this.x > rockRight) {
      this.x = rockRight;
    }
  }
  this.crashWith = function(otherObject) {
    let myleft = this.x ;
    let myright  = this.x + (this.width);
    let mytop = this.y;
    let mybottom = this.y + (this.height);
    let otherleft = otherObject.x;
    let otherright = otherObject.x + (otherObject.width);
    let othertop = otherObject.y;
    let otherbottom = otherObject.y +(otherObject.height);
    let crash = true;
    if ((((mybottom - 10) > othertop) || (mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))) {
      crash = false;
    }
    return crash;
  }  
}

function updateGameArea() {
  if (myGamePiece.crashWith(myObstacle)){
    myGamePiece.y = myObstacle.y - myGamePiece.height;
    myGamePiece.gravitySpeed = 0;
    myGamePiece.jump = 0;
  } else if (myGamePiece.crashWith(mySecondObstacle)){
    myGamePiece.y = mySecondObstacle.y - myGamePiece.height;
    myGamePiece.gravitySpeed = 0;
    myGamePiece.jump = 0;
  }
  if (myGamePiece.x > myPrincess.x - myGamePiece.width && myGamePiece.x < myPrincess.x + myGamePiece.width && myGamePiece.y > myPrincess.y - myGamePiece.height && myGamePiece.y < myPrincess.y + myGamePiece.height){
    myPrincess.x = myGamePiece.x + 25;
    myPrincess.y = myGamePiece.y - 25; 
    setTimeout(function(){
      window.location.href = "gnomes.html";
    }, 1350)
  } else if (myPrincess.crashWith(myGamePiece)){
    window.location.href = "gnomes.html";
  } else if (myPrincess.y === myGameArea.canvas.height - myPrincess.height) {
    myGameArea.stop();
    window.location.href = "game-over.html";
  } 
  myGameArea.clear();
  myBackground.speedX = -1;
  myBackground.update();
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;

  if (myGameArea.keys && myGameArea.keys[65]) {
    myGamePiece.speedX = -4;
    myBackground.x = myBackground.x + 2;
    if (myGamePiece.image.src[myGamePiece.image.src.length - 5] === "1") {
      setTimeout(function(){
        myGamePiece.image.src = "./assets/img/finn-L2.png";
      }, 200)
    } else {
      setTimeout(function(){
        myGamePiece.image.src = "./assets/img/finn-L1.png";
      }, 200)
    }
  }

  if (myGameArea.keys && myGameArea.keys[68]) {
    myGamePiece.speedX = 4;
    myBackground.x = myBackground.x - 2;
    if (myGamePiece.image.src[myGamePiece.image.src.length - 5] === "1") {
      setTimeout(function(){
        myGamePiece.image.src = "./assets/img/finn-R2.png";
      }, 200)
    } else {
      setTimeout(function(){
        myGamePiece.image.src = "./assets/img/finn-R1.png";
      }, 200)
    }
  }

  if (myGameArea.keys && myGameArea.keys[83]) {
    myGamePiece.speedY = 4; }
  if (myGameArea.keys && myGameArea.keys[32] && myGamePiece.speedY === 0) {
    myGamePiece.jump = -10;}
  console.log(myGamePiece.image.src[myGamePiece.image.src.length - 6], myGamePiece.image.src[myGamePiece.image.src.length - 5])
  
  myGamePiece.newPos();
  myGamePiece.update();
  myPrincess.newPos();
  myPrincess.update();
  myObstacle.update();
  mySecondObstacle.update();
  if (myBackground.x <= -1280) {
    myBackground.x = -1280;
    console.log("WW");
  }
  if (myBackground.x > 0) {
    myBackground.x = 0;
  }
  if(myPrincess) {
    myPrincess.gravity = .01;
  }
}

$(document).ready(function() {
  startGame();
});