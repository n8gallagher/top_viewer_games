const axios = require("axios");
let token = "dummy";
const client_id = process.env.CLIENT_ID.trim();
const secret = process.env.SECRET.trim();


function fetchToken() {
  return new Promise(function (resolve, reject) {
    axios
    .post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${secret}&grant_type=client_credentials`
    )
    .then((response) => {
      token = response.data.access_token;
      console.log("You set the accessToken successfully ");
    })
    .catch((error) => {
      console.log(error);
    });
  }).catch(err => 
    console.log("The request was not completed, no token ")
    )
}

if (token === "dummy") {
  fetchToken();
} else {
  console.log("already had a token" + token);
}
// function checkToken() {
//   return new Promise(function (resolve, reject) {
//     if (token !== "dummy") {
//       console.log("Access token has a value -- token: ");
//       resolve();
//     } else {
//       console.log("Access token is UNDEFINED, getting token")
//       axios.get('/token').then(
//         (res) => {
//           var result = res;
//           token = res.data.
//           resolve(result);
//         },
//         (error) => {
//           reject(error);
//         }
//       );
//     }
//   });
// }

