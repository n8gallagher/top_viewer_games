const axios = require("axios");
const express = require("express");
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const winston = require('winston');
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

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
    if (!client_id || !secret) {
      console.error("Missing Twitch API credentials. Please check your .env file.");
      return reject(new Error("Missing API credentials"));
    }
    
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
        console.log("✅ Twitch API token set successfully");
      })
      .catch((err) => {
        console.error("❌ Failed to get Twitch API token:", err.response?.data || err.message);
        reject(err);
      });
  }).catch((err) => {
    console.error("❌ Token request failed:", err.message);
  });
}

app.get("/setCache", () => {
  setCache();
})

app.get("/games", apiLimiter, async (req, res) => {
  try {
    if (cached_json !== null) {
      logger.info('Serving cached games data');
      return res.json(cached_json);
    }
    
    if (!helix) {
      logger.error('API request attempted without initialized Twitch client');
      return res.status(500).json({ 
        error: "Twitch API not initialized. Please check your credentials." 
      });
    }
    
    const response = await helix.get("games/top");
    await populateTotalViewersInGamesList(response.data.data);
    logger.info('Successfully fetched and processed games data');
    return res.json(populatedGamesList);
  } catch (err) {
    logger.error('Failed to fetch games data:', {
      error: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    res.status(500).json({ 
      error: "Failed to fetch games data from Twitch API",
      message: err.message 
    });
  }
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, HOST, () => {
  console.log(`Top Viewer Games listening at http://localhost:${PORT}`);
});

const countViewers = async (game_id) => {
  let totalViewers = 0;
  try {
    const response = await axios.get("https://api.twitch.tv/helix/streams", {
      params: {
        first: 100,
        game_id: game_id
      },
      headers: {
        "Client-ID": client_id,
        Authorization: "Bearer " + accessToken,
      },
    });

    if (response.data && Array.isArray(response.data.data)) {
      totalViewers = response.data.data.reduce((sum, stream) => 
        sum + (stream.viewer_count || 0), 0);
    }
    
    logger.info(`Fetched viewer count for game ${game_id}: ${totalViewers} viewers`);
    return totalViewers;
  } catch (err) {
    logger.error(`Error fetching viewers for game ${game_id}:`, {
      error: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    throw new Error(`Failed to fetch viewer count for game ${game_id}`);
  }
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