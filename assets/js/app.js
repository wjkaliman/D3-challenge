var svgWidth = 960;
var svgHeight = 500;
// group margins into an object
var margin = { top: 20, right: 40, bottom: 60, left: 100 };
console.log(margin)
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data from file location
d3.csv("./assets/data/data.csv").then(function (healthdata) {
    console.log(healthdata);
    // read the data for poverty and healthcare     
    healthdata.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions

    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthdata, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthdata, d => d.healthcare)])
        .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .classed("purple", true)
        .call(leftAxis);
    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "#00BFFF")
        .attr("opacity", ".5")
        ;
    // This is the abbreviation for states in the circles
    var textGroup = chartGroup.selectAll("text.stabber")
        .data(healthdata)
        .enter()
        .append("text")
        .attr("class", "stabbr")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d.poverty))
        .attr("dy", d => yLinearScale(d.healthcare))
        .style("text-anchor", "middle")
        .attr("stroke", "black");


    // Step 1: CREATE tooltips, assign it a class and Append a div to the body
    // When you click on the circles, this code goes into action.
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function (d) {
            return (`${d.state}<br>Poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);

        })
        .style("background-color", "#00DDFF");

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function (data) {
        toolTip.show(data);
    })
        // onmouseout event
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("stroke", "#CC33FF") //y text
        .text("In Poverty (%)")
        ;
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("stroke", "red") //X text
        .text("Lacks Healthcare (%)");
}).catch(function (error) {
    console.log(error);
});






