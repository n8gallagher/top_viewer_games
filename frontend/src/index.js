import { select, scaleLinear, max, scaleBand, axisLeft, axisBottom, format } from "d3";
import axios from "axios";

const svg = select("svg");
svg.style("background-color", "black");
const width = +svg.attr("width");
const height = +svg.attr("height");

const render = data => {
  const xValue = d => d.totalViewers;
  const yValue = d => d.name;
  const margin = { top: 40, right: 40, bottom: 60, left: 225 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain([0, max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xAxis = axisBottom(xScale).tickFormat(format(".3s"));

  g.append("g")
    .call(axisLeft(yScale))
    .selectAll(".domain, .tick line")
    .remove();

  const xAxisG = g.append("g").call(xAxis).attr("transform", `translate(0, ${innerHeight})`);

  xAxisG.select(".domain").remove();
  xAxisG.selectAll(".tick line").attr("color", "rgb(233, 233, 233)");

  xAxisG.append("text")
    .attr("y", 48)
    .attr("x", innerWidth / 2)
    .attr("class", "axis-label")
    .text("Current Viewers (approximate)");

  g.append("text")
    .attr("y", -5)
    .attr("x", (innerWidth / 2) - margin.left - margin.right)
    .attr("class", "main-label")
    .text("Top 10 Games by Viewership");

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", d => yScale(yValue(d)))
    .attr("width", d => xScale(xValue(d)))
    .attr("height", yScale.bandwidth());
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

async function main() {
  const res = await getGames("/games");
  const games = res.data.slice(0, 10);
  if (games.length) {
    render(games);
  }
}

document.addEventListener("DOMContentLoaded", () => main());
