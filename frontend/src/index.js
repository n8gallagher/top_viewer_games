const axios = require('axios');
let games;

function getGames(path) {
  return new Promise(function (resolve, reject) {
      axios.get(path).then(
          (res) => {
              var result = res;
              console.log('Processing Request');
              games = result.data.data.slice(0, 10);
              resolve(result);
          },
              (error) => {
              reject(error);
          }
      );
  });
}

async function main() {
  let result = await getGames('/games');
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
  setTimeout(function(){
    main();
  }, 1000)
});