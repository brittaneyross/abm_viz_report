function hStackedBar(obscsv_file,modelcsv_file,obsID,modelID, labelwidth, divwidth){

  var formatValue = d3.format(".2s");

  makechart(modelcsv_file, modelID, true, labelwidth, "modelchart");
  makechart(obscsv_file, obsID, false, 20, "obschart");

function makechart(csv_file, divID, axis, marginleftval, idval){
  var div = d3.select("body").append("div")
  .attr("class", "vmttooltip")
  .style("opacity", 0);

  var margin = {top: 35, right: 20, bottom: 50, left: marginleftval},
    width = divwidth - 160 - margin.right,
    height = 600 - margin.top - margin.bottom;

  var g = d3.select("#"+divID).append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 500 600")
    .attr("id",idval)
    .append("g")
      .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var y = d3.scaleBand()			// x = d3.scaleBand()
      .rangeRound([0, height])	// .rangeRound([0, width])
      .paddingInner(0.25)
      .align(0.1);

  var x = d3.scaleLinear()		// y = d3.scaleLinear()
      .rangeRound([0, width]);	// .rangeRound([height, 0]);

  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  d3.csv(csv_file, function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
     d.total = t;
     return d;
    }, function(error, data) {
     if (error) throw error;

     var keys = data.columns.slice(1);
     keys.pop()

     data.sort(function(a, b) { return a.order - b.order; });
     y.domain(data.map(function(d) { return d.Index; }));					// x.domain...
     x.domain([0, d3.max(data, function(d) { return d.total; })]).nice();	// y.domain...
     z.domain(keys);


    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
        .attr("fill", function(d) {
          return z(d.key); })
      .selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("y", function(d) {
          return y(d.data.Index); })	    //.attr("x", function(d) { return x(d.data.Index); })
        .attr("x", function(d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("height", y.bandwidth())
        .attr("class", function(d) {return d.data.Index.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, "")})
        // this highlights the same line on the two bar charts
        .on("mouseover", function(d) {
          div.transition()
          .duration(200)
          .style("opacity", .9);
          div.html(
            "</b><p style='color:#98abc5; font-size: 20px; margin-bottom: 0px;'>" + d3.format(".4~s")(d.data.Auto) +
            "</p><p style='color:grey; font-size: 10px;'> auto" +
            "</p><p style='color:#8a89a6; font-size: 20px; margin-bottom: 0px;'>" + d3.format(".4~s")(d.data.Truck) +
            "</p><p style='color:grey; font-size: 10px;'> truck </p>"
            )
            .style("left", (d3.event.pageX) + "px")
            .style("top",  (d3.event.pageY - 28) + "px");

          d3.selectAll("." + d.data.Index.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, ""))
            .attr("fill", "#cf4446");
          selectedline = d.data.Index.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, "")
          selectednumber = d.data.order;
          // this highlights the line on the map!
          hwy_lyr.eachLayer(function(layer) {
            if(layer.feature.properties.abmnum == selectednumber){
              layer.setStyle({
                color:"#cf4446"
              })
            }
          })
          })
        .on("mouseout", function(d) {
          div.transition()
          .duration(500)
          .style("opacity", 0);


          d3.selectAll("." + d.data.Index.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, ""))
            .attr("fill", function(d) {
            return z[1]; });
          selectedline = d.data.Index.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, "")
          selectednumber = d.data.order;
          // this highlights the line on the map!
          hwy_lyr.eachLayer(function(layer) {
            if(layer.feature.properties.abmnum == selectednumber){
              layer.setStyle({
                color:"grey"
              })
            }
          })
        });


    if(axis == true){
       g.append("g")
           .attr("class", "axis")
           .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
          .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));
    }
    // g.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis")
  	  .attr("transform", "translate(0,"+height+")")				// New line
        .call(d3.axisBottom(x).ticks(4, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("y", 2)												//     .attr("y", 2)
        .attr("x", x(x.ticks().pop()) + 0.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
  	  .attr("transform", "translate("+ (-width) +",30)");   	// Newline

    if(axis == false){
    }
  });

}

}
