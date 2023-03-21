const axios = require("axios");
const express = require("express");
const app = express();
require('dotenv').config()

const path = require("path"); //???
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

let helix;
let populatedGamesList;
let accessToken = "dummy";
let accessTokenSet = false;
let accessTokenTimeout = 5400000;
let cached_json = null;
const client_id = process.env.CLIENT_ID.trim();
const secret = process.env.SECRET.trim();

if (accessTokenSet) {
  console.log("already had an accessToken");
} else {
  fetchToken();
  accessTokenSet = true;
  setTimeout(function () {
    accessTokenSet = false;
    fetchToken();
    accessTokenSet = true;
  }, accessTokenTimeout);
}

function setCache() {
  console.log('resetting cache!')
  helix
    .get("games/top")
    .then((response) => populateTotalViewersInGamesList(response.data.data))
    .then((response) => {
      cached_json = populatedGamesList;
    })
    .catch((err) => console.log(err));
}

setInterval( () => {setCache()}, 1000 * 60 * 10) // get new data 
                                                // for the cache every 
                                                // 10 minutes
app.use("/", express.static("frontend"));

function fetchToken() {
  return new Promise(function (resolve, reject) {
    axios
      .post(
        `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${secret}&grant_type=client_credentials`
      )
      .then((response) => {
        accessToken = response.data.access_token;
        helix = axios.create({
          baseURL: "https://api.twitch.tv/helix/",
          headers: {
            "Client-ID": client_id,
            Authorization: "Bearer " + accessToken,
          },
        });
        setCache();
        accessTokenSet = true;
        console.log("You set the accessToken successfully ");
      })
      .catch((err) => {
        console.log(err);
      });
  }).catch((err) => console.log("The request was not completed, no token "));
}

app.get("/setCache", () => {
  setCache();
})

app.get("/games", (req, res) => {
  if (cached_json !== null){
    return res.json(cached_json)
  }
  helix
    .get("games/top")
    .then((response) => populateTotalViewersInGamesList(response.data.data))
    .then((response) => res.json(populatedGamesList))
    .catch((err) => console.log(err));
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, HOST, () => {
  console.log(`Top Viewer Games listening at http://localhost:${PORT}`);
});

const countViewers = async (game_id) => {
  let totalViewers = 0;
  await axios
    .get("https://api.twitch.tv/helix/streams?first=100&game_id=" + game_id, {
      headers: {
        "Client-ID": client_id,
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((response) => {
      let array = response.data.data;
      for (let i = 0; i < array.length - 1; i++) {
        totalViewers = totalViewers + array[i].viewer_count;
      }
    })
    .catch((err) => console.log(err));

  return totalViewers;
};

const populateTotalViewersInGamesList = async (gamesList) => {
  for (let i = 0; i < gamesList.length; i++) {
    let game = gamesList[i];
    game.totalViewers = await countViewers(game.id);
  }
  populatedGamesList = gamesList;
};

// testing route for retrieving a token -  the same code is included in fetchToken ^
// app.get("/token", (req, res) => {
//   axios
//     .post(
//       `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${secret}&grant_type=client_credentials`
//     )
//     .then((response) => {
//       accessToken = response.data.access_token;
//       console.log("You set the accessToken successfully");
//       res.send(response.data);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// });

// Posible code for rebuild
// import requests
// import json
// import matplotlib.pyplot as plt

// # get top 10 games from Twitch API
// url = 'https://api.twitch.tv/helix/games/top'
// headers = {'Client-ID': 'YOUR_CLIENT_ID'}
// params = {'first': 10}
// response = requests.get(url, headers=headers, params=params)
// data = json.loads(response.text)

// # extract game names and viewership numbers
// game_names = [game['name'] for game in data['data']]
// viewership_numbers = [game['viewer_count'] for game in data['data']]

// # create bar graph
// plt.bar(game_names, viewership_numbers)
// plt.xlabel('Game Name')
// plt.ylabel('Viewership')
// plt.title('Top 10 Games by Viewership')
// plt.show()