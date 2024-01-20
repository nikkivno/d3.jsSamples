

document.addEventListener("DOMContentLoaded", function () {
    d3.json("Assets/data.json").then(function (treeData) {
      

      const width = 600;
      const height = 400;
  
      const treeLayout = d3.tree().size([height, width]);
  
      const rootNode = d3.hierarchy(treeData);
  
      treeLayout(rootNode);
  
      // Append SVG container to the body
      const svg = d3.select("#collapsibleTree").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(40,0)");
  
      // Add links between nodes
      svg.selectAll(".link")
        .data(rootNode.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
          .x(function(d) { return d.y; })
          .y(function(d) { return d.x; })
        );
  
      // Add nodes
      const nodes = svg.selectAll(".node")
        .data(rootNode.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  
      // Add circles to represent nodes
      nodes.append("circle")
        .attr("r", 5);
  
      // Add labels to nodes
      nodes.append("text")
        .attr("dy", ".31em")
        .attr("x", function(d) { return d.children ? -8 : 8; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .attr("fill", "white")
        .text(function(d) { return d.data.name; });
    });
  });