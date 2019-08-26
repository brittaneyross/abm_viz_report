function make_h_stacked(csv_file,divID, legendID){



  var margin = {top: 80, right: 10, bottom: 0, left: 75},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


  var g = d3.select("#"+divID).append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 960 500")
  .attr("align","center")
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");


    var y = d3.scaleBand()
        .rangeRound([0, height])
        .padding(0.1)
        .align(0.1);

    var x = d3.scaleLinear()
        .rangeRound([0, width]);

    var z = d3.scaleOrdinal()
        .range(['#0E84AC',	'#548E3F','#E9A7A7',	'#FBFBFB',	'#E57272',	'#D8BA37',	'#84C87E',	'#5F7B88',	'#9675B4',	'#5F5121']);

    var stack = d3.stack()
        .offset(d3.stackOffsetExpand);

    var div = d3.select("#" + divID).append("div")
      .attr("class", "bartooltip")
      .style("opacity", 0);

    d3.csv(csv_file, type, function (error, data) {
        if (error) throw error;

        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)

        // List of groups = species here = value of the first column called group -> I show them on the X axis
        var groups = d3.map(data, function(d){return(d.Index)}).keys()

        y.domain(data.map(function (d) {
            return d.Index;
        }));
        z.domain(data.columns.slice(1));

        var mouseover = function(d, i) {
          var coordinates = d3.mouse(this);
          var x = coordinates[0];
          var y = coordinates[1];
          // what subgroup are we hovering?
          var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
          var subgroupValue = d.data[subgroupName];
          var obsvalue;
          var modelvalue;

          d3.selectAll("."+divID+"class").style("opacity", 0.2).select("text").remove();

          var bardata = serie.selectAll("rect")
              .data(function (d) {
                if(d.key == subgroupName){
                  modelvalue =  (d[0].data[subgroupName])
                  obsvalue =  (d[1].data[subgroupName])
                }
                return d
              })

          //console.log(obsvalue)
          div.transition()
          //.attr("class","popuptext")
          .duration(200)
          .style("opacity", .9);
          div.html(
            "<br><b><p style='font-size: 12px'; color: grey'>" + subgroupName.replace(/_/g, " ") +
            "</p></b><p style='color:rgb(28, 78, 128); font-size: 20px; margin-bottom: 0px;'>" + d3.format(".4~s")(modelvalue) +
            "</p><p style='color:grey; font-size: 10px;'> modeled" +
            "</p><p style='color:rgb(166, 186, 206); font-size: 20px; margin-bottom: 0px;'>" + d3.format(".4~s")(obsvalue) +
            "</p><p style='color:grey; font-size: 10px;'> observed </p>"
            )
            .style("left", x*0.7 + "px")
            .style("top",  function() {
              if (y < 120){
                return (y*2  + "px")}
              else {
                return (y) + "px"
            }
          })


          // Highlight all rects of this subgroup with opacity 0.8. It is possible to select them since they have a specific class = their name.
          d3.selectAll("."+subgroupName)
            .style("opacity", 1)
        }

      // When user do not hover anymore
      var mouseleave = function(d) {
        // Back to normal opacity: 0.8
        d3.selectAll("."+divID+"class")
          .style("opacity",0.8)
          .select("text").remove();

        d3.selectAll(".bartooltip").style("opacity", 0);
        }


        var serie = g.selectAll(".serie")
            .data(stack.keys(data.columns.slice(1))(data))
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function (d) {
                return z(d.key);
            })
            .attr("class", function(d){
              return divID+"class " + d.key })



        var bar = serie.selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("y", function (d) {
                return y(d.data.Index);
            })
            .attr("x", function (d) {
                return x(d[0]);
            })
            .attr("width", function (d) {
                return x(d[1]) - x(d[0]);
            })
            .attr("height", y.bandwidth())
            .on("mouseover", mouseover)
            .on("mouseout", mouseleave)

        bar.append("text")
            .attr("x", function (d) {
                return x(d[1]);
            })
            .attr("dy", "1.35em")
            .text(function (d) { return d; });

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y));

            // select the svg area
    var legend = d3.select("#"+legendID).append("svg")
    .attr("height", 300)
    .attr("width", 250)

    // create a list of keys
    var keys = data.columns.slice(1)

    // Usually you have a color scale in your chart already
    var color = d3.scaleOrdinal()
      .domain(keys)
        .range(['#0E84AC',	'#548E3F','#E9A7A7',	'#FBFBFB',	'#E57272',	'#D8BA37',	'#84C87E',	'#5F7B88',	'#9675B4',	'#5F5121']);

    // Add one dot in the legend for each name.
    legend.selectAll("mydots")
      .data(keys)
      .enter()
      .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return color(d)})

    // Add one dot in the legend for each name.
    legend.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 20)
        .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .text(function(d){ return d.replace(/_/g, " ")})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        });

    function type(d, i, columns) {
        var t;
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d.total = t;
        return d;
    }
}
