d3.json("./Assets/bardata.json").then(function (response) {
  const data = response;

  const width = 1000;
  const height = 500;
  const marginTop = 10;
  const marginBottom = 50;
  const marginLeft = 50;
  const marginRight = 20;

  data.sort(
    (a, b) => a.year.localeCompare(b.year) || a.month.localeCompare(b.month)
  );

  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from(new Set(data.map((d) => d.year)));

  const fx = d3
    .scaleBand()
    .domain(month)
    .range([marginLeft, width - marginRight])
    .paddingInner(0.1)
    .paddingOuter(0.2);

  data.sort(
    (a, b) => a.month.localeCompare(b.month) || a.year.localeCompare(b.year)
  );

  const colorForYears = d3
    .scaleOrdinal()
    .domain(years)
    .range(d3.schemeSet2)
    .unknown("#ccc");

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height - marginBottom, marginTop]);

  const formatValue = (x) => (isNaN(x) ? "N/A" : x.toLocaleString("en"));

  const svg = d3
    .select("#barGraph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto;");

  svg
    .append("g")
    .selectAll()
    .data(data)
    .join("rect")
    .attr(
      "x",
      (d) =>
        fx(d.month) + (fx.bandwidth() / years.length) * years.indexOf(d.year)
    )
    .attr("y", (d) => y(d.value))
    .attr("width", fx.bandwidth() / years.length)
    .attr("height", (d) => y(0) - y(d.value))
    .attr("fill", (d) => colorForYears(d.year));

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(fx).tickFormat((d) => d.split(" ")[0]))
    .call((g) => g.selectAll(".domain").attr("stroke", "white"))
    .call((g) =>
      g
        .selectAll("text")
        .attr("fill", "white")
        .style("text-anchor", "middle")
        .attr("dy", "0.5em")
    );

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisLeft(y).ticks(null, "s").tickFormat(formatValue))
    .call((g) => g.selectAll(".domain").attr("stroke", "white"))
    .call((g) => g.selectAll("text").attr("fill", "white"));

  svg.selectAll(".tick text").attr("fill", "white");

  svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call((g) => g.selectAll(".domain").attr("stroke", "white"))
    .call((g) => g.selectAll("text").attr("fill", "white"));

  return Object.assign(svg.node(), { scales: { colorForYears } });
});