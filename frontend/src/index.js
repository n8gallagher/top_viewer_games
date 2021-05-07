const axios = require("axios");
import { 
  select, 
  scaleLinear, 
  max, 
  scaleBand, 
  axisLeft, 
  axisBottom, 
  format 
} 
  from "d3";

let games;

const svg = select('svg')
svg.style('background-color', 'black')
const width = +svg.attr("width");
const height = +svg.attr("height");

const render = (data) => {
  const xValue = d => d.totalViewers;
  const yValue = d => d.name;
  const margin = { top: 40, right: 40, bottom: 60, left: 225 }
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain([0, max(games, xValue)])
    .range([0, innerWidth]);

    
  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  const g =  svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

  const xAxis = axisBottom(xScale)
    .tickFormat(format('.3s'))

  g.append('g')
    .call(axisLeft(yScale))
    .selectAll('.domain, .tick line')
      .remove();

  const xAxisG = g.append('g').call(xAxis)
  .attr('transform', `translate(0, ${innerHeight})`)

  xAxisG
  .select('.domain')
    .remove();

  xAxisG
    .selectAll('.tick line')
      .attr('color', 'rgb(233, 233, 233)');

  xAxisG.append('text')
    .attr('y', 48)
    .attr('x', innerWidth / 2)
    .attr('class', 'axis-label')
    .text('Current Viewers (approximate)')

  g.append('text')
    .attr('y', -5)
    .attr('x', (innerWidth / 2) - margin.left - margin.right)
    .attr('class', 'main-label')
    .text('Top 10 Games by Viewership')

  g
    .selectAll("rect")
    .data(data)
    .enter().append("rect")
      .attr('y', d => yScale(yValue(d)))
      .attr("width", (d) => xScale(xValue(d)))
      .attr("height", yScale.bandwidth());
};

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
    // let gamesList = document.querySelector(".gamesList");
    // games.map((game, i) => {
    //   let li = document.createElement("li");
    //   li.appendChild(
    //     document.createTextNode(
    //       `#${i + 1} Title: ${game.name} | GameId: ${
    //         game.id
    //       } | Total Current Viewers: ${game.totalViewers} | Box Art: `
    //     )
    //   );
    //   let image;
    //   let imageUrl = game.box_art_url.substring(
    //     0,
    //     game.box_art_url.length - 21 // get rid of the end of the box_art_url string
    //   );
    //   image = document.createElement("img");
    //   image.src = imageUrl + "-150x200" + ".jpg"; // 150x200 pixels for each box art jpg
    //   image.id = game.id + i;
    //   li.appendChild(image);

    //   gamesList.append(li);
      render(games);
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  main();
  
});
