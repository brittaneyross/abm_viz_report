var h = ["", "03:00 AM to 05:00 AM",
  "05:00 AM to 05:30 AM",
  "05:30 AM to 06:00 AM",
  "06:00 AM to 06:30 AM",
  "06:30 AM to 07:00 AM",
  "07:00 AM to 07:30 AM",
  "07:30 AM to 08:00 AM",
  "08:00 AM to 08:30 AM",
  "08:30 AM to 09:00 AM",
  "09:00 AM to 09:30 AM",
  "09:30 AM to 10:00 AM",
  "10:00 AM to 10:30 AM",
  "10:30 AM to 11:00 AM",
  "11:00 AM to 11:30 AM",
  "11:30 AM to 12:00 PM",
  "12:00 PM to 12:30 PM",
  "12:30 PM to 01:00 PM",
  "01:00 PM to 01:30 PM",
  "01:30 PM to 02:00 PM",
  "02:00 PM to 02:30 PM",
  "02:30 PM to 03:00 PM",
  "03:00 PM to 03:30 PM",
  "03:30 PM to 04:00 PM",
  "04:00 PM to 04:30 PM",
  "04:30 PM to 05:00 PM",
  "05:00 PM to 05:30 PM",
  "05:30 PM to 06:00 PM",
  "06:00 PM to 06:30 PM",
  "06:30 PM to 07:00 PM",
  "07:00 PM to 07:30 PM",
  "07:30 PM to 08:00 PM",
  "08:00 PM to 08:30 PM",
  "08:30 PM to 09:00 PM",
  "09:00 PM to 09:30 PM",
  "09:30 PM to 10:00 PM",
  "10:00 PM to 10:30 PM",
  "10:30 PM to 11:00 PM",
  "11:00 PM to 11:30 PM",
  "11:30 PM to 12:00 AM",
  "12:00 PM to 03:00 AM"
]
//make_multi_line_dd("data/csv37_tours_tod.csv", "my_dataviz", "#todcat")

function make_multi_line_dd(csv, divID, catID, legendID) {
  var margin = {
      top: 50,
      right: 100,
      bottom: 30,
      left: 60
    },
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#" + divID)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 700 600")
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");



  //Read the data
  d3.csv(csv, function(data) {

    catInt = d3.select(catID).property('value');
    d3.select(catID).on('change', update);

    var newdata = data.filter(function(d) {
      return d.cat == catInt;
    });

    // group the data: I want to draw one line per group
    var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
      .key(function(d) {
        if (d.cat == catInt) {
          return d.subgroup
        }
      })
      .entries(newdata);

    // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain([1, 40])
      .range([0, width]);

    svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(40).tickFormat(function(d,i) {
        return i%3 ? "" : h[d]
      }))
      .selectAll("text")
      .attr("y", 5)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(35)")
      .style("text-anchor", "start");

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(newdata, function(d) {
        return +d.value;
      })])
      .range([height, 0]);
    svg.append("g")
      .attr("class", "yaxis")
      .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

    // color palette
    var res = sumstat.map(function(d) {
      return d.key
    }) // list of group names
    var color = d3.scaleOrdinal()
      .domain(res)
      .range(["#0E84AC","#2a4d59", "#6fdb48","#519c36"])


    //Create legend
    var ml_legend = d3.select("#" + legendID).append("svg")
      .attr('width', 300)
      .attr('height', 100)

    ml_legend.append("line").attr("x1", 10).attr("y1", 20).attr("x2", 30).attr("y2", 20).style("stroke", "#519c36").style("stroke-width", 5).style("stroke-dasharray", "5,5")
    ml_legend.append("text")
      .attr("x", 35)
      .attr("y", 20)
      .text("Observed Departure Time")
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .attr("alignment-baseline", "middle")

    ml_legend.append("line").attr("x1", 10).attr("y1", 40).attr("x2", 30).attr("y2", 40).style("stroke", "#6fdb48").style("stroke-width", 5).style("stroke-dasharray", "5,5")
    ml_legend.append("text")
      .attr("x", 35)
      .attr("y", 40)
      .text("Observed Arrival Time")
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .attr("alignment-baseline", "middle")

    ml_legend.append("line").attr("x1", 10).attr("y1", 60).attr("x2", 30).attr("y2", 60).style("stroke", "#2a4d59").style("stroke-width", 5)
    ml_legend.append("text")
      .attr("x", 35)
      .attr("y", 60)
      .text("Modeled Departure Time")
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .attr("alignment-baseline", "middle")


    ml_legend.append("line").attr("x1", 10).attr("y1", 80).attr("x2", 30).attr("y2", 80).style("stroke", "#0E84AC").style("stroke-width", 5)
    ml_legend.append("text")
      .attr("x", 35)
      .attr("y", 80)
      .text("Modeled Arrival Time")
      .style("font-size", "14px")
      .style("font-family", "sans-serif")
      .attr("alignment-baseline", "middle")

    // Draw the line
    svg.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", function(d) {
        return color(d.key)
      })
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", function(d) {
        return d.key.startsWith('Survey') ? ("10,3") : ("1,0")
      })
      .attr("d", function(d) {
        return d3.line()
          .x(function(d) {
            return x(d.xaxis);
          })
          .y(function(d) {
            return y(+d.value);
          })
          (d.values)
      })

    function update() {

      catInt = d3.select(catID).property('value');
      var newdata = data.filter(function(d) {
        return d.cat == catInt;
      });

      // group the data: I want to draw one line per group
      var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) {
          if (d.cat == catInt) {
            return d.subgroup
          }
        })
        .entries(newdata);

      // Add X axis --> it is a date format
      var x = d3.scaleLinear()
        .domain([1, 40])
        .range([0, width]);

      svg.selectAll(".line").remove();
      svg.selectAll(".xaxis").remove();
      svg.selectAll(".yaxis").remove();

      svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(40).tickFormat(function(d,i) {
          return i%3 ? "" : h[d]
        }))
        .selectAll("text")
        .attr("y", 5)
        .attr("x", 9)
        .attr("dy", ".35em")
        .attr("transform", "rotate(55)")
        .style("text-anchor", "start");

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(newdata, function(d) {
          return +d.value;
        })])
        .range([height, 0]);

      svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(y).tickFormat(d3.format(".0%")));

      // color palette
      var res = sumstat.map(function(d) {
        return d.key
      }) // list of group names
      var color = d3.scaleOrdinal()
        .domain(res)
        .range(["#0E84AC","#2a4d59", "#6fdb48","#519c36"])

      // Draw the line
      var new_layer = svg.selectAll(".line")
        .data(sumstat)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", function(d) {
          return color(d.key)
        })
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", function(d) {
          return d.key.startsWith('Survey') ? ("10,3") : ("1,0")
        })
        .attr("d", function(d) {
          return d3.line()
            .x(function(d) {
              return x(d.xaxis);
            })
            .y(function(d) {
              return y(+d.value);
            })
            (d.values)
        })
    }

  })
}
