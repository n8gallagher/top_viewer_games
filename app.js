import axios from 'axios'
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use("/", express.static("frontend"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});


const client_id = process.env.CLIENT_ID;
const secret = process.env.SECRET
//add route to fetch from Twitch API

const fetchToken = () => {
  let accessToken;

  axios.post(`https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${secret}&grant_type=client_credentials`)
      .then(response => {
          accessToken = response.data.access_token;
          return accessToken;

  }
}

app.use(express.static(path.join(__dirname)));

app.listen(PORT, HOST, () => {
  console.log(`Top Viewer Games listening at http://localhost:${PORT}`);
});


const helix = axios.create({
  baseURL: 'https://api.twitch.tv/helix/',
  headers: {'Client-ID': client_id, 'Authorization': 'Bearer ' + fetchToken()}
});

helix.get('games/top').then(function (response) {
	console.log(response);
});
