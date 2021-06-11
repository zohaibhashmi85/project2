// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

  // if the SVG area isn't empty when the browser loads,
  // remove it and replace it with a resized version of the chart
  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width and
  // height of the browser window.
  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 30,
    bottom: 100,
    right: 100,
    left: 100
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // Append SVG element
  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

  // Append group element
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Read CSV
  d3.json("http://127.0.0.1:5000//release").then(function(medalData) {

      // create date parser
      var dateParser = d3.timeParse("%Y");

      // parse data
      medalData.forEach(function(data) {
        data.release_year = dateParser(data.release_year);
        data.Titles = +data.Titles;
      });

      // create scales
      var xTimeScale = d3.scaleTime()
        .domain(d3.extent(medalData, d => d.release_year))
        .range([0, width]);

      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(medalData, d => d.Titles)])
        .range([height, 0]);

      // create axes
      var xAxis = d3.axisBottom(xTimeScale).tickFormat(d3.timeFormat("%Y"));
      var yAxis = d3.axisLeft(yLinearScale).ticks(6);

      // append axes
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

      chartGroup.append("g")
        .call(yAxis);

      // line generator
      var line = d3.line()
        .x(d => xTimeScale(d.release_year))
        .y(d => yLinearScale(d.Titles));

      // append line
      chartGroup.append("path")
        .data([medalData])
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "red");

      // append circles
      var circlesGroup = chartGroup.selectAll("circle")
        .data(medalData)
        .enter()
        .append("circle")
        .attr("cx", d => xTimeScale(d.release_year))
        .attr("cy", d => yLinearScale(d.Titles))
        .attr("r", "10")
        .attr("fill", "gold")
        .attr("stroke-width", "1")
        .attr("stroke", "black");

      // Date formatter to display dates nicely
      var dateFormatter = d3.timeFormat("%Y");

      // Step 1: Initialize Tooltip
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`<strong>${dateFormatter(d.release_year)}<strong><hr>${d.Titles}
          Shows`);
        });

      // Step 2: Create the tooltip in chartGroup.
      chartGroup.call(toolTip);

      // Step 3: Create "mouseover" event listener to display tooltip
      circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
      // Step 4: Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });

      // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Number of Shows");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top })`)
    .attr("class", "axisText")
    .text("Release Year");
    }).catch(function(error) {
      console.log(error);
    });
}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);
