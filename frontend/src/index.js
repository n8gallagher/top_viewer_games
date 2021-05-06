const axios = require("axios");
let games;

function getGames(path) {
  return new Promise(function (resolve, reject) {
    axios.get(path).then(
      (res) => {
        console.log("Processing Request");
        resolve(res);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

async function main() {
  let res = await getGames("/games");
  games = res.data.slice(0, 10);
  if (games.length) {
    let gamesList = document.querySelector(".gamesList");
    games.map((game, i) => {
      let li = document.createElement("li");
      li.appendChild(
        document.createTextNode(
          `#${i + 1} Title: ${game.name} | GameId: ${game.id} | Total Current Viewers: ${game.totalViewers} | Box Art: `
        )
      );
      let image;
      let imageUrl = game.box_art_url.substring(
        0,
        game.box_art_url.length - 21 // get rid of the end of the box_art_url string
      );
      image = document.createElement("img");
      image.src = imageUrl + "-150x200" + ".jpg"; // 150x200 pixels for each box art jpg
      image.id = game.id + i;
      li.appendChild(image);

      gamesList.append(li);
    });
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  main();
});
