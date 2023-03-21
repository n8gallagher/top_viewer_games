import { select, scaleLinear, max, scaleBand, axisLeft, axisBottom, format } from "d3";
import axios from "axios";

const svg = select("svg");
svg.style("background-color", "black");
const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  // ... (existing render function code)
};

const getGames = async path => {
  try {
    const res = await axios.get(path);
    console.log("Processing Request");
    return res;
  } catch (error) {
    console.error("Error fetching games data:", error);
  }
};

async function update() {
  await axios.get('/setCache');
  main();
}

async function main() {
  const res = await getGames("/games");
  const games = res.data.slice(0, 10).sort((a, b) => b.totalViewers - a.totalViewers);
  if (games.length) {
    // ... (existing main function code)
    render(games);
    let updateButton = document.getElementById('update')
    updateButton.addEventListener('click', update)
    let spinner = document.querySelector("#hide-spinner");
    spinner.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => main());
