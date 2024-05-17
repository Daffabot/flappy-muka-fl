const leftBtn = document.getElementById("left");
const rightBtn = document.getElementById("right");
const start = document.getElementById("start");
const charIMG = document.getElementById("charimg");
let info = document.getElementById("display");
let urut = 0;
let data;

async function fetchData() {
    try {
      const response = await fetch('./data/char.json'); // Ganti path dengan path yang benar
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      data = await response.json();
      const Object = data[urut];
      if (Object) {
        // Mengambil properti Image dan menyimpannya dalam variabel string
        const ObjectImage = Object.Image;
        const name = Object.Name;
        const imageHD = Object.ImageHD;
        localStorage.setItem('myData', ObjectImage);
        charIMG.style.backgroundImage = "url(" + imageHD + ")";
        info.textContent = name;
        console.log("ImageHD URL for the object:", imageHD);
      } else {
        console.log("The object is not found.");
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    }
  }

  fetchData()

function left() {
    if (urut > 0) {
        urut--
    }
    fetchData()
}

function right() {
    if (urut < data.length) {
        urut++
    }
    fetchData()
}

function next() {
  window.location.href = "./game.html";
}

leftBtn.addEventListener("click", left);
rightBtn.addEventListener("click", right);
start.addEventListener("click", next);