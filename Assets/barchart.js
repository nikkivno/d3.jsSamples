d3.json("./Assets/bardata.json").then(function(response) {

const data = response; 

console.log(data)

const width = 1000;
const height = 500;
const marginTop = 10;
const marginBottom = 50;
const marginLeft = 50;
const marginRight = 20;

const fx = d3.scaleBand()
    .domain(new Set(data.map(d => d.year)))
    .rangeRound([marginLeft, width - marginRight])
    .paddingInner(0.1);

const months = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const color = d3.scaleOrdinal()
.domain(months)
.range(d3.schemeCategory10);

const x = d3.scaleBand()
.domain(months)
.rangeRound([0, fx.bandwidth()])
.padding(0.05);

const y = d3.scaleLinear()
.domain([0, d3.max(data, d => d.value)]).nice()
.rangeRound([height - marginBottom, marginTop]);

const formatValue = x => isNaN(x) ? "N/A" : x.toLocaleString("en")

const svg = d3.select("#barGraph").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

svg.append("g")
    .selectAll()
    .data(d3.group(data, d => d.year))
    .join("g")
      .attr("transform", ([year]) => `translate(${fx(year)},0)`)
    .selectAll()
    .data(([, d]) => d)
    .join("rect")
      .attr("x", d => x(d.month))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => color(d.year));

svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisLeft(y).ticks(null, "s").tickFormat(formatValue))
    .call(g => g.selectAll(".domain").attr("stroke", "white"))
    .call(g => g.selectAll("text").attr("fill", "white"));

svg.selectAll(".tick text").attr("fill", "white");

svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.selectAll(".domain").attr("stroke", "white"))
        .call(g => g.selectAll("text").attr("fill", "white"));

return Object.assign(svg.node(), {scales: {color}});
});