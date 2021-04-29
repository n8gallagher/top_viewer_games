const axios = require('axios');
let games;

function getGames(path) {
  return new Promise(function (resolve, reject) {
      axios.get(path).then(
          (res) => {
              console.log('Processing Request');
              resolve(res);
          },
              (error) => {
              reject(error);
          }
      );
  });
}

async function main() {
  let res = await getGames('/games');
  games = res.data.data.slice(0, 10);
  if (games.length) {
    let gamesList = document.querySelector('.gamesList')
    games.map((game, i) => {
      let li = document.createElement('li')
      li.appendChild(document.createTextNode(`#${i + 1} Title: ${game.name}`))
      gamesList.append(li)
    })
  }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    main();
});