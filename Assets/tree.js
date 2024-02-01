document.addEventListener("DOMContentLoaded", function () {
  d3.json("Assets/treedata.json").then(function (treeData) {
    const width = 1000;
    const height = 400;

    const margin = { top: 50, right: 200, bottom: 50, left: 200 };
    const treeWidth = width - margin.left - margin.right;
    const treeHeight = height - margin.top - margin.bottom;

    const treeLayout = d3.tree().size([treeHeight, treeWidth]);

    const rootNode = d3.hierarchy(treeData);

    treeLayout(rootNode);

    const svg = d3
      .select("#collapsibleTree")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    update();

    function toggle(e, d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      treeLayout(rootNode);
      update();
    }

    function update() {
      // Update the nodes
      const nodes = svg
        .selectAll(".node")
        .data(rootNode.descendants(), function (d) {
          return d.data.id;
        });

      const links = svg.selectAll(".link").data(rootNode.links());

      const linkEnter = links
        .enter()
        .insert("path", ".node")
        .attr("class", "link")
        .attr(
          "d",
          d3
            .linkHorizontal()
            .x(function (d) {
              return d.y;
            })
            .y(function (d) {
              return d.x;
            })
        )
        .style("stroke", "#fe019a")
        .style("stroke-width", 1);

      const nodeEnter = nodes
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        })
        .on("click", toggle);

      nodeEnter
        .append("circle")
        .attr("r", 4)
        .attr("fill", (d) => (d._children ? "#555" : "#999"))
        .attr("stroke-width", 10)
        .style("fill", "white");

      nodeEnter
        .append("text")
        .attr("dy", ".31em")
        .attr("x", function (d) {
          return d.data.name === "Favourte Books" ? 8 : d.children ? -8 : 8;
        })
        .style("text-anchor", function (d) {
          return d.children ? "end" : "start";
        })
        .style("fill", "white")
        .text(function (d) {
          return d.data.name;
        })
        .attr("stroke-linejoin", "round");

      nodes
        .merge(nodeEnter)
        .transition()
        .duration(750)
        .attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

      links
        .merge(linkEnter)
        .transition()
        .duration(750)
        .attr(
          "d",
          d3
            .linkHorizontal()
            .x(function (d) {
              return d.y;
            })
            .y(function (d) {
              return d.x;
            })
        );

      nodes.exit().remove();
      links.exit().remove();
    }
  });
});
