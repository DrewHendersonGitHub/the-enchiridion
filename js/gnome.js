let myGamePiece;
let myFinn;
let myGnome1;
let myGnome2;
let myGnome3;
let myObstacle;
let mySecondObstacle;
let myThirdObstacle;
let myBackground;
let gnomeArray;
let grandma1;
let grandma2;
let grandmaArray;
let firepit;

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
  myFinn = new component("image", 43, 70, "./assets/img/finn-R1.png", 10, 430, "finn");
  myGamePiece = new component("image", 43, 70, "./assets/img/jake-L1.png", 10, 430, "jake");
  grandma1 = new component("image", 50, 70, "./assets/img/grandma1.png", 330, 0, "grandma");
  grandma2 = new component("image", 50, 70, "./assets/img/grandma2.png", 260, 0, "grandma");
  myGnome1 = new component("image", 50, 70, "./assets/img/gnome1.png", 400, 0, "gnome");
  myGnome2 = new component("image", 50, 70, "./assets/img/gnome2.png", 240, 0, "gnome");
  myGnome3 = new component("image", 50, 70, "./assets/img/gnome3.png", 600, 0, "gnome");
  gnomeArray = [myGnome1, myGnome2, myGnome3];
  grandmaArray= [grandma1, grandma2];
  firepit = new component("image", 100, 120, "./assets/img/fire.png", 1000, 600, "fire")
  myObstacle = new component("image", 100, 35, "./assets/img/log.png", 320, 375, "platform");
  mySecondObstacle = new component("image", 100, 35, "./assets/img/log.png", 520, 275, "platform");
  myThirdObstacle = new component("image", 100, 35, "./assets/img/log.png", 220, 175, "platform");
  myBackground = new component("image", 2000, 500, "./assets/img/gnomebg.jpg", 0, 0, "background");
  $(".col-md-8" ).append( myGameArea.canvas);
};

function component(type, width, height, color, x, y, name) {
  this.type = type;
  if (type === "image" || type === "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.name = name;
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
    if (this.name != "gnome" && this.name != "grandma" && this.name !="fire") {
      this.hitTop();
      this.hitLeft();
      this.hitRight();
    }
    
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
  } else if (myGamePiece.crashWith(myThirdObstacle)){
    myGamePiece.y = myThirdObstacle.y - myGamePiece.height;
    myGamePiece.gravitySpeed = 0;
    myGamePiece.jump = 0;
  }
  gnomeArray.forEach(function(gnome) {
    if (gnome.crashWith(myObstacle)){
      gnome.y = myObstacle.y - gnome.height;
      gnome.gravitySpeed = 0;
      gnome.jump = 0;
    } else if (gnome.crashWith(mySecondObstacle)){
      gnome.y = mySecondObstacle.y - gnome.height;
      gnome.gravitySpeed = 0;
      gnome.jump = 0;
    } else if (gnome.crashWith(myThirdObstacle)){
      gnome.y = myThirdObstacle.y - gnome.height;
      gnome.gravitySpeed = 0;
      gnome.jump = 0;
    }
    if (myGamePiece.x > gnome.x - myGamePiece.width && myGamePiece.x < gnome.x + myGamePiece.width && myGamePiece.y > gnome.y - myGamePiece.height && myGamePiece.y < gnome.y + myGamePiece.height){
      gnome.x = myGamePiece.x + 25;
      gnome.y = myGamePiece.y - 25;
      gnome.gravitySpeed = 0;
      myGamePiece.image.src = "./assets/img/jake-angry.png";
      myGamePiece.width = 80;
      myGamePiece.height = 120;
    }
  })
  grandmaArray.forEach(function(gnome) {
    if (gnome.crashWith(myObstacle)){
      gnome.y = myObstacle.y - gnome.height;
      gnome.gravitySpeed = 0;
      gnome.jump = 0;
      
    } else if (gnome.crashWith(mySecondObstacle)){
      gnome.y = mySecondObstacle.y - gnome.height;
      gnome.gravitySpeed = 0;
      gnome.jump = 0;
    } else if (gnome.crashWith(myThirdObstacle)){
      gnome.y = myThirdObstacle.y - gnome.height;
      gnome.gravitySpeed = 0;
      gnome.jump = 0;
    }
  })
  myGameArea.clear();
  myBackground.update();
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;

  if (myGameArea.keys && myGameArea.keys[65]) {
    myGamePiece.speedX = -4;
    myBackground.x += 2;
    myObstacle.x += 3;
    mySecondObstacle.x += 3;
    myThirdObstacle.x += 3;
    myGnome1.x += 3;
    myGnome2.x += 3;
    myGnome3.x += 3;
    grandma1.x +=3;
    grandma2.x +=3;
    firepit.x +=3;
    if (myGamePiece.image.src[myGamePiece.image.src.length - 5] === "1") {
      setTimeout(function(){
        myGamePiece.image.src = "./assets/img/jake-L2.png";
      }, 200)
    } else {
      setTimeout(function(){
        myGamePiece.image.src = "./assets/img/jake-L1.png";
      }, 200)
    }
  }

  if (myGameArea.keys && myGameArea.keys[68]) {
    myGamePiece.speedX = 4;
    myObstacle.x -= 3;
    mySecondObstacle.x -= 3;
    myThirdObstacle.x -= 3;
    myGnome1.x -= 3;
    myGnome2.x -= 3;
    myGnome3.x -= 3;
    grandma1.x -= 3;
    grandma2.x -= 3;
    firepit.x -= 3;
    myBackground.x -= 2;
    if (myGamePiece.image.src[myGamePiece.image.src.length - 5] === "1") {
      setTimeout(function(){
        myGamePiece.image.src = "./assets/img/jake-R2.png";
      }, 200)
    } else {
      setTimeout(function(){
        myGamePiece.image.src = "./assets/img/jake-R1.png";
      }, 200)
    }
  }

  gnomeArray.forEach(function(gnome) {
    if (gnome.crashWith(firepit)){
      gnome.x = 20000;
      myGamePiece.width = 43;
      myGamePiece.height = 70;
    }
  })

  

  if (myGameArea.keys && myGameArea.keys[83]) {
    myGamePiece.speedY = 4; }
  if (myGameArea.keys && myGameArea.keys[32] && myGamePiece.speedY === 0) {
    myGamePiece.jump = -10;}
  console.log(myGamePiece.image.src[myGamePiece.image.src.length - 6], myGamePiece.image.src[myGamePiece.image.src.length - 5])
  grandma1.newPos();
  grandma1.update();
  grandma2.newPos();
  grandma2.update();
  myGamePiece.newPos();
  myGamePiece.update();
  myGnome1.newPos();
  myGnome1.update();  
  myGnome2.newPos();
  myGnome2.update();  
  myGnome3.newPos();
  myGnome3.update();  
  firepit.newPos();
  firepit.update();  
  myObstacle.update();
  mySecondObstacle.update();
  myThirdObstacle.update();
  if (myBackground.x <= -1280) {
    myBackground.x = -1280;
    console.log("WW");
  }
  if (myBackground.x > 0) {
    myBackground.x = 0;
  }
  setTimeout(function(){
    grandma1.x = -20000
  }, 5000);
  setTimeout(function(){
    grandma2.x = -20000
  }, 7500);
  if (myGnome1.x > 10000 && myGnome2.x > 10000 && myGnome3.x > 10000){
    setTimeout(function(){
      window.location.href = "game-over.html"
    }, 10)
  }
}

$(document).ready(function() {
  startGame();
});