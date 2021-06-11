// Define SVG area dimensions
var svgWidth = 1350;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 100,
  right: 100,
  bottom: 100,
  left: 100
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select(".chart")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data
d3.json("/titles").then(function (tvData) {
  console.log(tvData);

  // Cast the hours value to a number for each piece of tvData
  tvData.forEach(function(d) {
    d.Titles = +d.Titles;
  });

  tvData.sort(function(a,b) {
    return parseFloat(b.Titles) - parseFloat(a.Titles);
  });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(tvData.map(d => d.Country))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(tvData, function(d) {return d.Titles})])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece of tvData
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(tvData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.Country))
    .attr("y", d => yLinearScale(d.Titles))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.Titles));
  
   // Create axes labels
  chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - chartMargin.left + 30)
   .attr("x", 0 - (chartHeight / 2))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Number of Shows");

 chartGroup.append("text")
   .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.top - 60})`)
   .attr("class", "axisText")
   .text("List of Countries");

}).catch(function(error) {
  console.log(error);
});
