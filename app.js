const axios = require("axios");
const express = require("express");
const app = express();

const path = require("path"); //???
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

let helix;
let accessToken = "dummy";
let accessTokenSet = false;
let accessTokenTimeout = 5400000;
const client_id = process.env.CLIENT_ID.trim();
const secret = process.env.SECRET.trim();

let game_id = 516575;

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
        accessTokenSet = true;
        console.log("You set the accessToken successfully ");
      })
      .catch((err) => {
        //what is this?
        console.log(err);
      });
  }).catch((err) => console.log("The request was not completed, no token ")); //compared to this?
}

app.get("/games", (req, res) => {
  helix
    .get("games/top")
    .then((response) => res.json(response.data))
    .catch((err) => console.log(err));
});

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

app.get("/gameData", (req, res) => {
  let totalViewers = 0;
  axios.get(
    "https://api.twitch.tv/helix/streams?first=100&game_id=" +
      game_id,
    {
      headers: {
        "Client-ID": client_id,
        Authorization: "Bearer " + accessToken,
      },
    }).then(response => {
      let array = response.data.data
      for(let i = 0; i < array.length - 1; i++) {
        totalViewers = totalViewers + array[i].viewer_count;
      }
      console.log(`total viewers for ${array[0].game_name}: ${totalViewers}`)
    }).catch(err => console.log(err));
});

// function fetchStreams(game_id, page, after, tot) {
//   page = page ? page : 0;
//   document.getElementById('loader_' + game_id).textContent = 'Loading Page: ' + page + ' Current ' + tot;
//   fetch(
//       'https://api.twitch.tv/helix/streams?first=100&game_id=' + game_id + (after ? '&after=' + after : ''),
//       {
//           "headers": {
//               "Client-ID": client_id,
//               "Authorization": "Bearer " + accessToken
//           }
//       }
//   )
//   .then(resp => resp.json())
//   .then(resp => {
//       document.getElementById('loader_' + game_id).textContent = 'Processing Page: ' + page;

//       var total = parseInt(document.getElementById('count_' + game_id).textContent);
//       for (var x=0;x<resp.data.length;x++) {
//           total += resp.data[x].viewer_count;
//       }
//       document.getElementById('count_' + game_id).textContent = total;

//       var d = document.createElement('td');
//       d.textContent = resp.data.length;
//       document.getElementById('loader_row_' + game_id).append(d);

//       // loop if we got a cursor
//       if (resp.hasOwnProperty('pagination') && resp.pagination.hasOwnProperty('cursor')) {
//           page++;
//           // do a page limit check
//           if (page >= limit) {
//               document.getElementById('loader_' + game_id).textContent = 'Stopped at Page: ' + page + ' - ' + resp.data.length;
//               return;
//           }
//           fetchStreams(game_id, page, resp.pagination.cursor, total);
//       } else {
//           document.getElementById('loader_' + game_id).textContent = 'Last Page: ' + page + ' - ' + resp.data.length;
//       }
//   })
//   .catch(err => {
//       console.log(err);
//       document.getElementById('loading').textContent = 'Something went wrong';
//   });
// }
