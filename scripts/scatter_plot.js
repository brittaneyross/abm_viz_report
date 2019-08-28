function makeScatter(csv_file, chart_id, modelvalue,obsvalue,category_value,rsquared){
  var margin = {top: 5, right: 5, bottom: 50, left: 80},
	    width = 500 - margin.left - margin.right,
	    height = 450 - margin.top - margin.bottom;

  var formatValue = d3.format(".2s");
    var padding = 10;
	  var svg = d3.select(chart_id).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 -100 900 600")
	    .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	  d3.csv(csv_file, types, function(error, data){
      var x = d3.scaleLinear()
       .domain([0,d3.max(data, function(d){
         return d[obsvalue];
        })])
       .range([padding,width - padding*2]);

      console.log(d3.max(data, function(d){
        return d[obsvalue];
      }));

  	  var y = d3.scaleLinear()
      .domain([d3.min(data, function(d){
        return(d[modelvalue]);
      }),
      d3.max(data, function(d){
        return d[modelvalue];
       })]) //y range is reversed because svg
       .range([height-padding, padding]);

  	  var xAxis = d3.axisBottom()
          .scale(x)
          .tickFormat(d3.format(".2s"));

  	  var yAxis = d3.axisLeft()
          .scale(y)
          .tickFormat(d3.format(".2s"));


          // colors for foo
      var color = d3.scaleOrdinal()
      .domain(["Arterial/Collector", "Interstate" ])
      .range(["#0E84AC","#548E3F"])

      //x = survey
      //Y = Model
	    y.domain(d3.extent(data, function(d){ return parseFloat(d[modelvalue])}));
	    x.domain(d3.extent(data, function(d){ return parseFloat(d[obsvalue])}));

	    // see below for an explanation of the calcLinear function
      var yval = data.map(function (d) { return parseFloat(d[modelvalue]); });
      var xval = data.map(function (d) { return parseFloat(d[obsvalue]); });
	    var lr = linearRegression(yval,xval);
      d3.select("#"+rsquared).text(parseFloat(lr.r2).toPrecision(3));
      var max = d3.max(data, function (d) { return d[obsvalue]; });
      var myLine = svg.append("line")
                  .attr("id", "line")
                  .attr("x1", x(0))
                  .attr("y1", y(lr.intercept))
                  .attr("x2", x(max))
                  .attr("y2", y( (max * lr.slope) + lr.intercept ))
                  .style("stroke", "black");

        svg.append("g")
          .style("font", "10px sans-serif")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height-padding) + ")")
          .call(xAxis);

        svg.append("text")
        .style("font", "10px sans-serif")
        .attr("transform",
              "translate(" + (width/2) + " ," +
                              (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Observed: " + obsvalue);

      svg.append("g")
          .style("font", "10px sans-serif")
          .attr("class", "y axis")
          .attr("transform", "translate(" + padding + ",0)")
          .call(yAxis);

      svg.append("text")
      .style("font", "10px sans-serif")
      .attr("transform",
            "translate(-50," +
                            (height/2) + ") rotate(-90)")
      .style("text-anchor", "middle")
      .text("Model");

      if (chart_id == '#scatter_vmt'){
        svg.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 2.5)
        .attr("cy", function(d){ return y(d[modelvalue])})
        .attr("cx", function(d){ return x(d[obsvalue])})
        .style("fill",function(d){
          return color(d[category_value])
        })
        .style("opacity", .2)
      } else{
        svg.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("r", 3)
        .attr("cy", function(d){ return y(d[modelvalue])})
        .attr("cx", function(d){ return x(d[obsvalue])})
        .style("fill",function(d){
          return color(d[category_value])
        })
        .style("stroke","#f0f0f0")
        .style("stroke-width", .25) ;
      }

      if (chart_id == '#scatter_vmt'){
        var legend = d3.select("#scatterLegend").append("svg")
        .attr("height", 75)
        .attr("width", 250)

        var keys = ["Arterial/Collector", "Interstate"]

        var color = d3.scaleOrdinal()
          .domain(keys)
          .range(["#0E84AC", "#548E3F"])

        legend.selectAll("mydots")
          .data(keys)
          .enter()
          .append("circle")
            .attr("cx", 10)
            .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d) { return color(d); })

        // Add one dot in the legend for each name.
        legend.selectAll("mylabels")
          .data(keys)
          .enter()
          .append("text")
            .attr("x", 20)
            .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .text(function(d){
              return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .style("fill","black")
          }
        function update(selectedGroup){
          if (selectedGroup == "All"){
            var dataFilter = data
          } else{
            var dataFilter = data.filter(function(d){return d.FacilityType == selectedGroup})
          }
          //Remove all points
          svg.selectAll(".point").remove()
          d3.select("#line").remove();

          var x = d3.scaleLinear()
           .domain([0,d3.max(dataFilter, function(d){
             return d[obsvalue];
            })])
           .range([padding,width - padding*2]);

          var y = d3.scaleLinear()
          .domain([d3.min(dataFilter, function(d){
            return(d[modelvalue]);
          }),
          d3.max(dataFilter, function(d){
            return d[modelvalue];
           })]) //y range is reversed because svg
           .range([height-padding, padding]);

          var xAxis = d3.axisBottom()
              .scale(x)
              .tickFormat(d3.format(".2s"));

          var yAxis = d3.axisLeft()
              .scale(y)
              .tickFormat(d3.format(".2s"));
          svg.select(".x")
          .transition()
          .call(xAxis);
          svg.select(".y")
          .transition()
          .call(yAxis);
          //Add new points
          svg.selectAll(".point")
          .data(dataFilter)
          .enter().append("circle")
          .attr("class", "point")
          .attr("r", 2.5)
          .attr("cy", function(d){ return y(d[modelvalue])})
          .attr("cx", function(d){ return x(d[obsvalue])})
          .style("fill",function(d){
            return color(d[category_value])
          })
          .style("opacity", .2)
          // see below for an explanation of the calcLinear function
          var yval = dataFilter.map(function (d) { return parseFloat(d[modelvalue]); });
          var xval = dataFilter.map(function (d) { return parseFloat(d[obsvalue]); });
          var lr = linearRegression(yval,xval);
          d3.select("#"+rsquared).text(parseFloat(lr.r2).toPrecision(3));
          var max = d3.max(dataFilter, function (d) { return d[obsvalue]; });
          var myLine = svg.append("line")
                      .attr("id", "line")
                      .attr("x1", x(0))
                      .attr("y1", y(lr.intercept))
                      .attr("x2", x(max))
                      .attr("y2", y( (max * lr.slope) + lr.intercept ))
                      .style("stroke", "black");
        }


        if (chart_id == '#scatter_vmt'){
          d3.select("#catLinkVol").on("change", function(d) {
            var selectedOption = d3.select(this).property("value")
            if (selectedOption == 'all'){
              filtername = "All"
            } else if (selectedOption == 'arterials') {
              filtername = "Arterial/Collector"
            } else if (selectedOption == 'interstate'){
              filtername = "Interstate"
            }
            update(filtername)
          })
        }
    });

	  function types(d){
	    d[obsvalue] = +d[obsvalue];
	    d[modelvalue] = +d[modelvalue];

	    return d;
	  }

    // Calculate a linear regression from the data

		// Takes 5 parameters:
    // (1) Your data
    // (2) The column of data plotted on your x-axis
    // (3) The column of data plotted on your y-axis
    // (4) The minimum value of your x-axis
    // (5) The minimum value of your y-axis

    // Returns an object with two points, where each point is an object with an x and y coordinate

    function linearRegression(y,x){

        var lr = {};
        var n = y.length;
        var sum_x = 0;
        var sum_y = 0;
        var sum_xy = 0;
        var sum_xx = 0;
        var sum_yy = 0;

        for (var i = 0; i < y.length; i++) {

            sum_x += x[i];
            sum_y += y[i];
            sum_xy += (x[i]*y[i]);
            sum_xx += (x[i]*x[i]);
            sum_yy += (y[i]*y[i]);
        }

        lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
        lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
        lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

        return lr;

};

}
