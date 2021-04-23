const axios = require("axios");
const express = require("express");
const app = express();

const path = require("path");
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

let helix;
let accessToken = "dummy";
let accessTokenSet = false;
let accessTokenTimeout = 6000000;
const client_id = process.env.CLIENT_ID.trim();
const secret = process.env.SECRET.trim();

if (accessTokenSet === false) {
  fetchToken();
  setTimeout(function(){
    accessTokenSet = false
    fetchToken();
  }, 5400000)
} else {
  console.log("already had an accessToken");
}

app.use("/", express.static("frontend"));

app.get("/games", (req, res) => {
  console.log(helix)
  helix
    .get("games/top")
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});

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
        headers: { "Client-ID": client_id, Authorization: "Bearer " + accessToken },
      });
      accessTokenSet = true;
      console.log("You set the accessToken successfully ");
    })
    .catch((error) => {
      console.log(error);
    });
  }).catch(err => 
    console.log("The request was not completed, no token ")
    )
}

app.get("/token", (req, res) => {
  axios
    .post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${secret}&grant_type=client_credentials`
    )
    .then((response) => {
      accessToken = response.data.access_token;
      console.log("You set the accessToken successfully");
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, HOST, () => {
  console.log(`Top Viewer Games listening at http://localhost:${PORT}`);
});


