document.addEventListener("DOMContentLoaded", function () {
    d3.json("Assets/treedata.json").then(function (treeData) {
      

      const width = 1000;
      const height = 500;

      const margin = { top: 0, right: 150, bottom: 50, left: 150 };
      const treeWidth = width - margin.left - margin.right;
      const treeHeight = height - margin.top - margin.bottom;
  
      const treeLayout = d3.tree().size([treeHeight, treeWidth]);
  
      const rootNode = d3.hierarchy(treeData);
  
      treeLayout(rootNode);
  
      // Append SVG container to the body
      const svg = d3.select("#collapsibleTree").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");
        // .attr("transform", "translate(0,0)")
  
      // Add links between nodes
      svg.selectAll(".link")
        .data(rootNode.links())
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.linkHorizontal()
        .x(function(d) { return d.y; })
        .y(function(d) { return d.x; })
        )
        .style("stroke", "white") 
        .style("stroke-width", 1);
  
      // Add nodes
      const nodes = svg.selectAll(".node")
        .data(rootNode.descendants())
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        .style("fill", "white")
        .on("click", toggle);
  
      // Add circles to represent nodes
      nodes.append("circle")
        .attr("r", 5)
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

  
      // Add labels to nodes
      nodes.append("text")
        .attr("dy", ".31em")
        .attr("x", function(d) { return d.children ? -8 : 8; })
        .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        .attr("fill", "white")
        .text(function(d) { return d.data.name; })
        .attr("stroke-linejoin", "round")
        .attr("stroke", "white")
        .style("font-family", "Arial");
        
        function toggle(d) {
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
    
        // function update() {
        //   // Update the nodes
        //   const node = svg.selectAll(".node")
        //     .data(rootNode.descendants(), function(d) { return d.data.id; });
    
        //   // Update the links
        //   const link = svg.selectAll(".link")
        //     .data(rootNode.links());
    
        //   // Enter any new links at the parent's previous position.
        //   const linkEnter = link.enter();
        //   linkEnter.insert("path", ".node")
        //     .attr("class", "link")
        //     .attr("d", d3.linkHorizontal()
        //       .x(function(d) { return d.y; })
        //       .y(function(d) { return d.x; })
        //     )
        //     .style("stroke", "#ccc")
        //     .style("stroke-width", 1);
    
        //   // Enter any new nodes at the parent's previous position.
        //   const newNode = node.enter().append("g")
        //     .attr("class", "node")
        //     .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
        //     .on("click", toggle);
    
        //   newNode.append("circle")
        //     .attr("r", 5)
        //     .attr("fill", d => d._children ? "#555" : "#999")
        //     .attr("stroke-width", 10)
        //     .style('fill', 'white');
    
        //   newNode.append("text")
        //     .attr("dy", ".31em")
        //     .attr("x", function(d) { return d.children ? -8 : 8; })
        //     .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
        //     .style("fill", "white")
        //     .text(function(d) { return d.data.name; })
        //     .attr("stroke-linejoin", "round");
    
        //   // Transition nodes and links to their new positions.
        //   const nodeUpdate = node.merge(newNode);
        //   const linkUpdate = link.merge(linkEnter);

    
        //   d3.transition().duration(750).selectAll(".link")
        //     .attr("d", d3.linkHorizontal()
        //       .x(function(d) { return d.y; })
        //       .y(function(d) { return d.x; })
        //     );
    
        //   d3.transition().duration(750).selectAll(".node")
        //     .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
        // }

        function update() {
          // Update the nodes
          const nodes = svg.selectAll(".node")
            .data(rootNode.descendants(), function(d) { return d.data.id; });
        
          // Update the links
          const links = svg.selectAll(".link")
            .data(rootNode.links());
        
          // Enter any new links at the parent's previous position.
          const linkEnter = links.enter().insert("path", ".node")
            .attr("class", "link")
            .attr("d", d3.linkHorizontal()
              .x(function(d) { return d.y; })
              .y(function(d) { return d.x; })
            )
            .style("stroke", "#ccc")
            .style("stroke-width", 1);
        
          // Enter any new nodes at the parent's previous position.
          const nodeEnter = nodes.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
            .on("click", toggle);
        
          nodeEnter.append("circle")
            .attr("r", 5)
            .attr("fill", d => d._children ? "#555" : "#999")
            .attr("stroke-width", 10)
            .style('fill', 'white');
        
          nodeEnter.append("text")
            .attr("dy", ".31em")
            .attr("x", function(d) { return d.children ? -8 : 8; })
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
            .style("fill", "white")
            .text(function(d) { return d.data.name; })
            .attr("stroke-linejoin", "round");
        
          // Transition nodes and links to their new positions.
nodes.merge(nodeEnter).transition().duration(750)
.attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

links.merge(linkEnter).transition().duration(750)
.attr("d", d3.linkHorizontal()
  .x(function(d) { return d.y; })
  .y(function(d) { return d.x; })
);

        
          // Remove any exiting nodes
          nodes.exit().remove();
          links.exit().remove();
        }
        
    });
  });

  