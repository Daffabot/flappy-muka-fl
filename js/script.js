//Dibuat oleh Daffabot
//Jangan lupa follow github dan kasih bintang reponya https://github.com/Daffabot

let myGameArea;
let myGamePiece;
let myObstacles = [];
let myscore;
let selectedChar;

const btnBack = document.getElementById("back");
const canvasContainer = document.getElementById("canvascontainer");
canvasContainer.innerHTML = "";

window.onload = () => {
  selectedChar = localStorage.getItem('myData');
  updateChar();
}

function updateChar() {
  myGamePiece = {
    image: new Image()
  }
  console.log("Data: ", selectedChar);
  myGamePiece.image.crossOrigin = "anonymous";
  myGamePiece.image.src = selectedChar;
}

function restartGame() {
  document.getElementById("loadingit()").play();
  document.getElementById("loadingit()").loop = true;
  document.getElementById("myfilter").classList.add('hidden');
  document.getElementById("myrestartbutton").classList.add('hidden');
  myGameArea.stop();
  myGameArea.clear();
  myGameArea = {};
  myGamePiece = {};
  myObstacles = [];
  myscore = {};
  canvasContainer.innerHTML = "";
  startGame();
}

function startGame() {
  document.getElementById("loadingit()").play();
  document.getElementById("loadingit()").loop = true;
  document.getElementById("con").classList.remove('bg-slate-600');
  document.getElementById("con").classList.add('bg-blue-200');
  myGameArea = new GameArea();
  myGamePiece = new Component(50, 50, selectedChar, 10, 75, "image");
  myscore = new Component("15px", "Consolas", "black", 220, 25, "text");
  myGameArea.start();
}

function GameArea() {
  this.canvas = document.createElement("canvas");
  this.canvas.classList.add('w-full');
  this.canvas.classList.add('h-80');
  // this.canvas.width = 215;
  // this.canvas.height = 160;
  canvasContainer.appendChild(this.canvas);
  this.canvas.getContext('2d', { willReadFrequently: true });
  this.context = this.canvas.getContext("2d");
  this.pause = false;
  this.frameNo = 0;
  this.start = function() {
    this.interval = setInterval(updateGameArea, 20);
  };
  this.stop = function() {
    clearInterval(this.interval);
    this.pause = true;
  };
  this.clear = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}

function Component(width, height, color, x, y, type) {
  this.type = type;
  if (type === "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
    const ctx = myGameArea.context;
    if (this.type === "image") {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    if (this.type === "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, 120, 20);
    }
  };
  this.crashWith = function(otherobj) {
    const imgData = myGameArea.context.getImageData(this.x, this.y, this.width, this.height);
    for (let i = 0; i <= imgData.data.length; i += 9) {
      if (imgData.data[i + 36] > 0) {
        const x = (i / 4) % this.width + this.x;
        const y = Math.floor(i / 4 / this.width) + this.y;
        if (x >= otherobj.x && x <= otherobj.x + otherobj.width && y >= otherobj.y && y <= otherobj.y + otherobj.height) {
          return true;
        }
      }
    }
    return false;
  };
}

function updateGameArea() {
  for (let i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      myGameArea.stop();
      document.getElementById("myfilter").classList.remove('hidden');
      document.getElementById("myrestartbutton").classList.remove('hidden');
      document.getElementById("loadingit()").loop = false;
      document.getElementById("loadingit()").pause();
      totalscore();
      setTimeout(function() {
        document.getElementById("text").innerHTML = count + ". SCORE: " + myscore.score;
      }, 500);
      return;
    }
  }
  if (myGameArea.pause === false) {
    myGameArea.clear();
    myGameArea.frameNo += 1;
    myscore.score += 1;
    if (myGameArea.frameNo === 1 || everyinterval(150)) {
      const x = myGameArea.canvas.width;
      const y = myGameArea.canvas.height - 100;
      const height = Math.floor(Math.random() * 100) + 1;
      const gap = Math.floor(Math.random() * 15) + 55;
      myObstacles.push(new Component(10, height, "./img/pipe.png", x, 0, "image"));
      myObstacles.push(new Component(10, x - height - gap, "./img/pipe.png", x, height + gap, "image"));
    }
    for (let i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].x += -1;
      myObstacles[i].update();
    }
    myscore.text = "SCORE: " + myscore.score;
    myscore.update();
    myGamePiece.x += myGamePiece.speedX;
    myGamePiece.y += myGamePiece.speedY;
    myGamePiece.update();
    if (myGamePiece.x < 0) {
      myGamePiece.x = 0;
    } else if (myGamePiece.x + myGamePiece.width > myGameArea.canvas.width) {
      myGamePiece.x = myGameArea.canvas.width - myGamePiece.width;
    }
    if (myGamePiece.y < 0) {
      myGamePiece.y = 0;
    } else if (myGamePiece.y + myGamePiece.height > myGameArea.canvas.height) {
      myGamePiece.y = myGameArea.canvas.height - myGamePiece.height;
    }
    return;
  }
}

function everyinterval(n) {
  return (myGameArea.frameNo / n) % 1 === 0;
}

function moveup(e) {
  myGamePiece.speedY = -1;
}

function movedown() {
  myGamePiece.speedY = 1;
}

function moveleft() {
  myGamePiece.speedX = -1;
}

function moveright() {
  myGamePiece.speedX = 1;
}

function clearmove(e) {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

const mainDiv = document.getElementById("score");
let count = 0;

function totalscore() {
  count++;
  const userDiv = document.createElement("div");
  userDiv.id = "text";
  userDiv.innerHTML = "<span>" + "</span>";
  mainDiv.appendChild(userDiv);
  setTimeout(function() {
    userDiv.id = "text" + count;
  }, 1200);
  const br1 = document.createElement("br");
  mainDiv.appendChild(br1);
}

const link = document.getElementById("play");

link.addEventListener("click", function() {
  console.log("pencet");
  link.classList.add('hidden');
  startGame();
});


//CONTROLLER MEKANIK

class JoystickElement {
  constructor(selector) {
      this.element = document.querySelector(selector);
      this.rect = this.calculateRect();
      this.current = this.original;

      // Recalculate the rect on resizing
      window.onresize = () => {
          this.rect = this.calculateRect();
      }
  }

  get original() {
      return {
          vector: {
              x: 0,
              y: 0
          },
          angle: 0,
          percentage: 0
      };
  }

  calculateRect() {
      let rect = this.element.getBoundingClientRect();

      return Object.assign(
          rect,
          {
              center: {
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2
              },
              radius: rect.width / 2 // Improve this
          }
      );
  }
}

class JoystickShaft extends JoystickElement {
  clamp(x, y, boundary) {
      // Trigonometry time!
      // - Who says what you learn in school won't become useful :D
      let diff = {
          x: x - this.rect.center.x,
          y: y - this.rect.center.y,
      };

      // Get the distance between the cursor and the center
      let distance = Math.sqrt(
          Math.pow(diff.x, 2) + Math.pow(diff.y, 2)
      );

      // Get the angle of the line
      let angle = Math.atan2(diff.x, diff.y);
      // Convert into degrees!
      this.current.angle = 180 - (angle * 180 / Math.PI);

      // If the cursor is distance from the center is
      // less than the boundary, then return the diff
      //
      // Note: Boundary = radius
      if (distance < boundary) {
          this.current.percentage = (distance / boundary) * 100;
          return this.current.vector = diff;
      }

      // If it's a longer distance, clamp it!
      this.current.percentage = 100;

      return this.current.vector = {
          x: Math.sin(angle) * boundary,
          y: Math.cos(angle) * boundary
      };
  }

  move(from, to, duration, callback) {
      Velocity(this.element, {
          translateX: [to.x, from.x],
          translateY: [to.y, from.y],
          translateZ: 0,
      },
          {
              duration: duration,
              queue: false,
              complete() {
                  if (typeof callback === 'function') {
                      callback();
                  }
              }
          }
      );
  }
}

class Joystick {
  constructor(base, shaft) {
      this.state = 'inactive';
      this.base = new JoystickElement(base);
      this.shaft = new JoystickShaft(shaft);
      this.boundary = this.base.rect.radius * 0.75;

      this.onactivate = function () { };
      this.ondrag = function () { };

      this.activate = this.activate.bind(this);
      this.deactivate = this.deactivate.bind(this);
      this.drag = this.drag.bind(this);
  }

  static get ANIMATION_TIME() {
      return 100;
  }

  attachEvents() {
      this.base.element.addEventListener('pointerdown', this.activate, false);
      document.addEventListener('pointerup', this.deactivate, false);
      document.addEventListener('pointermove', this.drag, false);

      return this;
  }

  detachEvents() {
      this.base.element.removeEventListener('pointerdown', this.activate, false);
      document.removeEventListener('pointerup', this.deactivate, false);
      document.removeEventListener('pointermove', this.drag, false);

      this.deactivate();

      return this;
  }

  activate() {
      this.state = 'active';
      this.base.element.classList.add('active');

      if (typeof this.onactivate === 'function') {
          this.onactivate();
      }

      return this;
  }

  deactivate() {
      console.log("lepas");
      clearmove()
      this.state = 'inactive';
      this.base.element.classList.remove('active');

      this.shaft.move(
          this.shaft.current.vector,
          this.shaft.original.vector,
          () => {
              this.shaft.current = this.shaft.original;
          }
      );

      return this;
  }

  drag(e) {
      if (this.state !== 'active') {
          return this;
      }

      this.shaft.move(
          this.shaft.original.vector,
          this.shaft.clamp(e.clientX, e.clientY, this.boundary),
          0,
          () => {
              if (typeof this.ondrag === 'function') {
                  this.ondrag();
              }
          }
      );

      return this;
  }
}

// Setup the Joystick
const joystick = new Joystick('.joystick-base', '.joystick-shaft');

// Attach the events for the joystick
// Can also detach events with the detachEvents function
joystick.attachEvents();

joystick.ondrag = function () {
  if (this.shaft.current.angle >= -45 && this.shaft.current.angle < 22.5) {
      console.log("atas");
      moveup()
  } else if (this.shaft.current.angle >= 22.5 && this.shaft.current.angle < 67.5) {
      console.log("atas kanan");
      moveup()
      moveright()
  } else if (this.shaft.current.angle >= 67.5 && this.shaft.current.angle < 112.5) {
      console.log("kanan");
      moveright()
  } else if (this.shaft.current.angle >= 112.5 && this.shaft.current.angle < 157.5) {
      console.log("kanan bawah");
      moveright()
      movedown()
  } else if (this.shaft.current.angle >= 157.5 && this.shaft.current.angle < 202.5) {
      console.log("bawah");
      movedown()
  } else if (this.shaft.current.angle >= 202.5 && this.shaft.current.angle < 247.5) {
      console.log("bawah kiri");
      movedown()
      moveleft()
  } else if (this.shaft.current.angle >= 247.5 && this.shaft.current.angle < 292.5) {
      console.log("kiri");
      moveleft()
  } else {
      console.log("kiri atas");
      moveleft()
      moveup()
  }
}

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

document.addEventListener('copy', function(e) {
  e.preventDefault();
});

document.addEventListener('cut', function(e) {
  e.preventDefault();
});

document.addEventListener('selectstart', function(e) {
  e.preventDefault();
});

function back() {
  window.location.href = "./index.html";
}

btnBack.addEventListener("click", back);