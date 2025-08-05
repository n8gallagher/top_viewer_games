// caching 
// server calls api every 10 mins without interaction
// on page refresh send cached version

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

// DOM elements
const svg = select('#chart');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const retryBtn = document.getElementById('retry-btn');
const refreshBtn = document.getElementById('refresh-btn');
const lastUpdated = document.getElementById('last-updated');
const sortSelect = document.getElementById('sort-select');

const width = +svg.attr("width");
const height = +svg.attr("height");

// Utility functions
const showLoading = () => {
  loadingSpinner.style.display = 'flex';
  errorMessage.classList.add('hidden');
  svg.style('display', 'none');
};

const hideLoading = () => {
  loadingSpinner.style.display = 'none';
  svg.style('display', 'block');
};

const showError = (message) => {
  loadingSpinner.style.display = 'none';
  errorMessage.classList.remove('hidden');
  svg.style('display', 'none');
  console.error('Error:', message);
};

const updateLastUpdated = () => {
  const now = new Date();
  lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
};

const sortGames = (games, sortType) => {
  const sortedGames = [...games];
  
  switch (sortType) {
    case 'viewers':
      return sortedGames.sort((a, b) => b.totalViewers - a.totalViewers);
    case 'name':
      return sortedGames.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedGames.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sortedGames;
  }
};

const render = (data) => {
  // Clear previous chart
  svg.selectAll('*').remove();
  
  const xValue = d => d.totalViewers;
  const yValue = d => d.name;
  const margin = { top: 40, right: 40, bottom: 60, left: 225 }
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  const g = svg.append('g')
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
      .attr('color', '#ecf0f1');

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

  g.selectAll("rect")
    .data(data)
    .enter().append("rect")
      .attr('y', d => yScale(yValue(d)))
      .attr("width", (d) => xScale(xValue(d)))
      .attr("height", yScale.bandwidth())
      .attr('rx', 4) // Rounded corners
      .attr('ry', 4);
};

function getGames(path) {
  return new Promise(function (resolve, reject) {
    axios.get(path).then(
      (res) => {
        console.log("Processing Request");
        resolve(res);
      },
      (error) => {
        console.error("API Error:", error);
        reject(error);
      }
    );
  });
}

function update() {
  main();
}

async function main() {
  try {
    showLoading();
    
    let res = await getGames("/games");
    games = res.data.slice(0, 10);
    
    if (games.length) {
      hideLoading();
      const sortType = sortSelect ? sortSelect.value : 'viewers';
      const sortedGames = sortGames(games, sortType);
      render(sortedGames);
      updateLastUpdated();
    } else {
      showError("No data received from server");
    }
  } catch (error) {
    showError("Failed to load game data. Please check your connection and try again.");
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function (event) {
  main();
  
  // Add event listeners for buttons
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      main();
    });
  }
  
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      main();
    });
  }
  
  // Add sort event listener
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      if (games && games.length) {
        const sortType = sortSelect.value;
        const sortedGames = sortGames(games, sortType);
        render(sortedGames);
      }
    });
  }
});