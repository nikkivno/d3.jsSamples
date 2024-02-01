const container = d3.select("#pieChart");

const svg = container.append("svg").attr("width", 1000).attr("height", 600);

svg
  .append("circle")
  .attr("cx", 300)
  .attr("cy", 300)
  .attr("r", 250)
  .attr("fill", "black")
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7);

backgroundCircleRadius = 225;

const colors = d3.scaleOrdinal(d3.schemePaired);

// const customColors = d3.scaleOrdinal([
//   '#fe019a',
//   '#54428E',
//   '#003459',
//   '#E1BC29',
//   '#218380',
//   '#9BC53D',
//   '#DDDBF1',
//   '#FFBF81',

// ]);

let details = [
  { genre: "Horror", number: 6 },
  { genre: "Romance", number: 5 },
  { genre: "Graphic Novel", number: 7 },
  { genre: "Non Fiction", number: 4 },
  { genre: "Contemporary", number: 8 },
  { genre: "SciFi", number: 9 },
  { genre: "Fantasy", number: 15 },
  { genre: "Historical Fiction", number: 3 },
  { genre: "Mystery/Thriller", number: 13 },
];

let data = d3
  .pie()
  .sort(null)
  .value(function (d) {
    return d.number;
  })(details);

console.log(data);

let segments = d3
  .arc()
  .innerRadius(0)
  .outerRadius(backgroundCircleRadius)
  .padRadius(50);

let sections = svg
  .append("g")
  .attr("transform", "translate(300, 250)")
  .selectAll("path")
  .data(data);
sections
  .enter()
  .append("path")
  .attr("d", segments)
  .attr("fill", function (d) {
    return colors(d.data.number);
  });

const textLabels = svg
  .append("g")
  .attr("transform", "translate(300, 250)")
  .selectAll("text")
  .data(data);

textLabels
  .enter()
  .append("text")
  .attr("x", function (d) {
    var center = segments.centroid(d);
    return center[0];
  })
  .attr("y", function (d) {
    var center = segments.centroid(d);
    return center[1]; // Adjust the vertical position for number text
  })
  .text(function (d) {
    return d.data.number;
  })
  .attr("text-anchor", "middle")
  .attr("dy", "0.35em")
  .style("fill", "white")
  .style("font-size", "25px");

//  Legend

const legendWidth = 200;

const legendX = 750;
const legendY = 125;

const legends = svg
  .append("g")
  .attr("transform", "translate(" + legendX + "," + legendY + ")")
  .selectAll(".legends")
  .data(data);

const legend = legends
  .enter()
  .append("g")
  .classed("legends", true)
  .attr("transform", function (d, i) {
    return "translate(0," + i * 30 + ")";
  });

legend
  .append("rect")
  .attr("width", 20)
  .attr("height", 20)
  .attr("fill", function (d) {
    return colors(d.data.number);
  });
legend
  .append("text")
  .text(function (d) {
    return d.data.genre;
  })
  .attr("fill", function (d) {
    return colors(d.data.number);
  })
  .attr("x", 30)
  .attr("y", 14)
  .style("font-size", "20px")
  .style("font-family", "Arial")
  .style("fill", "white");
