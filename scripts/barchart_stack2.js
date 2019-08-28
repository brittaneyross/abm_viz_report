
// set up stacked barchart with no dropdown (no dd) and 7 categories/14 bars
function makeStackedChart_nodd2(csv_file,dataTitle,divID){

  d3.csv(csv_file, function(error, data) {
    if (error) throw error;
    //catInt = allKey;
    //d3.select(catID).on('change', update);
    data.forEach(function(d){
      d.Value = parseInt(d.Value);
    })

    var margin = {top: 35, right: 75, bottom: 100, left: 45},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    height2 = 575 - margin.top - margin.bottom;

    var padding = 10;
    var xlabel = ["Model","Obs","Model","Obs","Model","Obs","Model","Obs","Model","Obs","Model","Obs","Model","Obs","Model","Obs"]

    var g = d3.select("#" + divID).append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 -10 900 500")
    .attr("align","center")
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);


    var z = d3.scaleOrdinal()
        .range(["#0E84AC", "#548E3F", "#D8BA37"]);

        var stack = d3.stack()
        .offset(d3.stackOffsetExpand);

    ////console.log("data", data);
    ////console.log("data", newdata);

    x0.domain(data.map(function(d) {
      return d.MainGroup; }));

    x1.domain(data.map(function(d) {
      return d.SubGroup; }))
      .rangeRound([0, x0.bandwidth()])
      .padding(0.2);

    var x2 = d3.scaleLinear()
        .domain([0,d3.max(data,function(d){
          return +d.xlabel
        })]).range([25,width-30]);

    z.domain(data.map(function(d) {
      return d.StackGroup; }))

    var keys = z.domain()

    var groupData = d3.nest()
      .key(function(d) {
            return d.SubGroup + d.MainGroup;
      })
      .rollup(function(d, i){
        ////console.log(d[0].Category)
            ////console.log(d)
            var d2 = {SubGroup: d[0].SubGroup, MainGroup: d[0].MainGroup}
          d.forEach(function(d){
              d2[d.StackGroup] = d.Value;
              divText = d.Title;
          })
          //console.log("rollup d", d, d2);
          return d2;
      })
      .entries(data)
      .map(function(d){ return d.value; });

    //console.log("groupData", groupData)

    var stackData = stack
      .keys(keys)(groupData)
    d3.select("#" + dataTitle).text(divText);
    //console.log("stackData", stackData)
    ////console.log("keys", keys)

    var serie = g.selectAll(".serie")
      .data(stackData)
      .enter().append("g")
        .attr("class", "serie")
        .attr("fill", function(d) { return z(d.key); });

    serie.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("class", "serie-rect")
        .attr("transform", function(d) {
          return "translate(" + x0(d.data.MainGroup) + ",0)"; })
        .attr("x", function(d) {
          return x1(d.data.SubGroup); })
        .attr("y", function(d) {return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x1.bandwidth())

        g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + (height + 5) + ")")
          .call(d3.axisBottom(x2).ticks(d3.max(data,function(d){
            return +d.xlabel
          })).tickFormat(function(d){
            return xlabel[parseInt(d)]
          }));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")

        // Add the X Axis
       g.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(12," + height * 1.1 + ")")
           .call(d3.axisBottom(x0))
           .call(d3.axisBottom(x0).tickSize(0))
           .selectAll("text")
            .style("font-weight", "bold")
            .style("text-anchor", "middle")
            .style("font-size","16px")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(0)"
                });

      if (divID  == 'cfstack'){
        var legend = d3.select("#vmtfacilityLegendNew").append("svg")
        .attr("height", 75)
        .attr("width", 250)

        var keys = ["Local", "Arterial", "Interstate"]

        var color = d3.scaleOrdinal()
          .domain(keys)
          .range(["#0E84AC", "#548E3F", "#D8BA37"])

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

        // var legend = serie.append("g")
        // .attr("font-family", "sans-serif")
        // .attr("font-size", 10)
        // .attr("text-anchor", "end")
        //     .attr("class", "legend")
        //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        //     legend.append("rect")
        //           .attr("x", width - 19)
        //           .attr("y", -20)
        //           .attr("width", 19)
        //           .attr("height", 19)
        //           .attr("fill", function(d) { return z(d.key); });

        //     legend.append("text")
        //       .attr("x", width-30)
        //       .attr("y", -10)
        //       .attr("dy", "0.32em")
        //       .style("fill","black")
        //       .text(function(d) {
        //         return d.key;
        //       });

      });

}
