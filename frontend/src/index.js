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

const svg = select('#mainChart')
svg.style('background-color', 'white')
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

  g.selectAll("rect")
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

function update() {
  main();
}

// UI State Management
function showLoading() {
  document.getElementById('loadingState').classList.remove('d-none');
  document.getElementById('errorState').classList.add('d-none');
  document.getElementById('chartContainer').classList.add('d-none');
}

function showError() {
  document.getElementById('loadingState').classList.add('d-none');
  document.getElementById('errorState').classList.remove('d-none');
  document.getElementById('chartContainer').classList.add('d-none');
}

function showData() {
  document.getElementById('loadingState').classList.add('d-none');
  document.getElementById('errorState').classList.add('d-none');
  document.getElementById('chartContainer').classList.remove('d-none');
  document.getElementById('lastUpdated').textContent = 
    `Last updated: ${new Date().toLocaleTimeString()}`;
}

function updateTotalViewers(games) {
  const total = games.reduce((sum, game) => sum + (game.totalViewers || 0), 0);
  document.getElementById('totalViewers').innerHTML = 
    total.toLocaleString() + '<small class="d-block">viewers</small>';
}

function renderGamesList(games) {
  const gamesList = document.getElementById('gamesList');
  gamesList.innerHTML = '';
  
  games.forEach((game, index) => {
    const imageUrl = game.box_art_url ? 
      game.box_art_url.replace('{width}', '150').replace('{height}', '200') : 
      '';
    
    const gameCard = document.createElement('div');
    gameCard.className = 'col-md-6 col-lg-4 mb-3';
    gameCard.innerHTML = `
      <div class="card h-100 border-0 shadow-sm">
        <div class="row g-0 h-100">
          <div class="col-4">
            <img src="${imageUrl}" class="img-fluid rounded-start h-100" 
                 style="object-fit: cover;" alt="${game.name} box art"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';">
          </div>
          <div class="col-8">
            <div class="card-body p-3">
              <div class="d-flex align-items-start justify-content-between">
                <span class="badge bg-primary">#${index + 1}</span>
              </div>
              <h6 class="card-title mt-2 mb-1">${game.name}</h6>
              <div class="text-primary fw-bold">
                <i class="fas fa-eye me-1"></i>
                ${(game.totalViewers || 0).toLocaleString()}
              </div>
              <small class="text-muted">viewers</small>
            </div>
          </div>
        </div>
      </div>
    `;
    gamesList.appendChild(gameCard);
  });
}

async function main() {
  showLoading();
  
  try {
    let res = await getGames("/games");
    games = res.data.slice(0, 10);
    
    if (games && games.length) {
      updateTotalViewers(games);
      renderGamesList(games);
      render(games);
      showData();
    } else {
      showError();
    }
  } catch (error) {
    console.error('Error fetching games:', error);
    showError();
  }
}

document.addEventListener("DOMContentLoaded", function (event) {
  main();
  
  // Add refresh button functionality
  document.getElementById('refreshBtn').addEventListener('click', function() {
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Refreshing...';
    btn.disabled = true;
    
    main().finally(() => {
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 1000);
    });
  });
});