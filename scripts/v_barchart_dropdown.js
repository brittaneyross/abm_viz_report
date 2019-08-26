function makeGroupVBar(csv_file,chartID,catID, nogroups,dataDescription,dtitle,legendID){

  var divText = document.getElementById(dataDescription);
  var divTitle = document.getElementById(dtitle);
  var ngroups= nogroups+1
  var formatValue = d3.format(".2s");
  var maxvalue = 0;
  var bartotal = 0;
  var margin = {top: 35, right: 45, bottom: 120, left: 45},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var g = d3.select(chartID).append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 -100 960 600")
  .attr("align","center")
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");


  let x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1),
    x1 = d3.scaleBand(),
    y = d3.scaleLinear().rangeRound([height, 0]);

  let xAxis = d3.axisBottom(x0),
    yAxis = d3.axisLeft(y).ticks(null, "s");

  g.append("g")
  .attr("class","axis axis--x")
  .attr("transform", "translate(0," + height + ")");

  // g.append("g")
  // .attr("class", "axis axis--y");

  var z = d3.scaleOrdinal()
  .range(["#0E84AC","#548E3F"]);

  var durations = 0;

  let afterLoad = () => durations = 750;

  var catInt, keys, copy, sortIndex;

  var keysLegend = [];

  catInt = d3.select(catID).property('value');
  //console.log(catInt);

  //makeChart();
  d3.queue()
  .defer(d3.csv, csv_file, function(d, i, columns) {
    for(var i = 1, ttl = 0, n = columns.length; i < n; ++i)
          d.chartCat = d.Category;
          d.dataType = d.Type;
          d.descr = d.Description;
          d.title = d.Title;
          ttl += d[columns[i]] = +d[columns[i]];
          d.total = ttl;
          return d;
  })
  .await(function(error, data){
    //console.log(data);
    if (error) throw error;
    d3.select(catID).on('change', update);
    // d3.select(checkBoxID).on('change', update); // Sort checkbox
    catInt = d3.select(catID).property('value');

    init();
    update();

    function init() {
      catInt = d3.select(catID).property('value');
      var newdata = data.filter(function(d){
        return d.Category == catInt;
      });
      sortIndex = newdata.map( function(d) {
        //console.log(d.Index);
        return d.Index} );
    }

    function update() {
      // ======== Initial/Sliced values ========
      catInt = d3.select(catID).property('value');

      var newdata = data.filter(function(d){
        //console.log(d)
        return d.Category == catInt;
      });
      ////console.log(newdata);
      keys = data.columns.slice(1, ngroups); //Filter columns for Group Labels
      ////console.log(keys)
      copy = [];
      //console.log(keys)
      keys.forEach(function(t) {
        t = t.slice(0)    //Slice column label to select subgroup
        copy.push(t)
      })

      //console.log(copy)
      var copyKeys = keys;

      keysLegend = []

      copyKeys.forEach(function(s) {
        s = s.slice(0)  //Slice column label to select subgroup
        keysLegend.push(s)
      })

      newdata.forEach(function(d, i, columns) {
        for (var i = 0, test = 0, n = keysLegend.length; i < n; ++i)
          //console.log(d[keysLegend[i]]);
          test += d[keysLegend[i]];
          d.totalSlice = test;
          //console.log("Group Total: ", d.totalSlice)
          //console.log(d);
          divText =  "Table Description: " + d.Description;
          divTitle =  d.Title;
        return d;
      })
      d3.select("#" + dataDescription).text(divText);
      d3.select("#" + dtitle).text(divTitle);
      //console.log(divText)
      //console.log(divTitle)
      // ======== Domain, Axis & Sort ========

      y.domain([0, d3.max(newdata, function(d) {
        //console.log(d)
        return d3.max(copy, function(key) {
          //console.log(d[key])
          return +d[key];
          });
        })
      ]).nice();

      g.selectAll(".axis.axis--y").transition()
        .duration(durations)
        .call(yAxis);

      var barGroups = g.selectAll(".layer") // Bargroups initialized here for proper sorting
        .data(newdata, function(d) {
          //console.log(d)
          return d.Index
        }); // DON'T FORGET KEY FUNCTION

      barGroups.enter().append("g")
        .classed('layer', true);

      barGroups.exit().remove();

      // newdata.sort( d3.select(checkBoxID).property("checked")
      //   ? function(a, b) {
      //     return b.totalSlice - a.totalSlice;
      //   }
      //   : function(a, b) {
      //     return sortIndex.indexOf(a.Index) - sortIndex.indexOf(b.Index);
      //   });
      x0.domain(newdata.map(function(d) {
        return d.Index;
      }));

      x1.domain(keys).rangeRound([0, x0.bandwidth()]);

      g.selectAll(".axis.axis--x").transition()
        .duration(durations)
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
      // ======== Grouped bars ========

      g.selectAll(".layer").transition().duration(durations)
        .attr("transform", function(d, i) {
          return "translate(" + x0(d.Index) + ",0)";
        });

      let bars = g.selectAll(".layer").selectAll("rect")
        .data(function(d) {
          return copy.map(function(key) {
            return {key: key, value: d[key]};
          });
        });

      bars = bars
        .enter()
        .append("rect")
        .attr("width", x1.bandwidth())
        .attr("x", function(d) { return x1(d.key); })
        .attr("fill", function(d) { return z(d.key); })
        .merge(bars);

      //console.log(x1.bandwidth());

      bars.transition().duration(durations)
        .attr("y", function(d) {
          return y(d["value"]);
        })
        .attr("height", function(d) {
          var yscaled = 0
          //work on scaling height
          if(y(d["value"]) < 0){
            yscaled = height;
          }
          else{
            yscaled = y(d["value"]);
          }
          //console.log(height);
          //console.log(yscaled);
          //console.log(height - y(d["value"]));
          return height - yscaled;});

      // ======== Grouped bar text ========

      let textOnBar = g.selectAll(".layer").selectAll("text")
        .data(function(d) {
          return copy.map(function(key) {
            return {key: key, value: d[key]};
          });
        });

      textOnBar = textOnBar
        .enter()
      .append("text")
        .attr("fill","black")
        .attr("font-size",11)
        .merge(textOnBar);

      textOnBar.transition().duration(durations)
        .attr("transform", function(d, i) {
          let x0 = x1.bandwidth() * i + 3,
              y0 = y(d.value) - 10;
          return "translate(" + x0 + "," + y0 + ") rotate(0)";
        })
        .text(function(d) {return formatValue(d.value)})

      // ======== Legend rects ========





      // legendText.transition().duration(durations)
      //   .text(function(d) {
      //     var sliceLegend = d.slice(0, -2)
      //     return sliceLegend;
      //   });

    } // End of update function

    var legend = d3.select("#"+legendID).append("svg")
    .attr("height", 75)
    .attr("width", 250)


    // legend.selectAll("legendrecs")
    //   .data(keysLegend)
    //   .enter()
    // .append("rect")
    //   .attr("x", 17)
    //   .attr("y", 8)
    //   .attr("width", 15)
    //   .attr("height", 15)
    //   .attr("stroke-width",2)
    //   .merge(legend)
    //
    // // ======== Legend text ========
    //
    // legend.selectAll("textonlegend")
    //   .data(keysLegend)
    //   .enter()
    // .append("text")
    //   .attr("x", 30)
    //   .attr("font-size",12)
    //   .attr("y", 8)
    //   .attr("dy", "0.32em");


    legend.selectAll("mydots")
      .data(keys)
      .enter()
      .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill",function(d, i) { return z(i); })

    // Add one dot in the legend for each name.
    legend.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 20)
        .attr("y", function(d,i){ return 20 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .text(function(d){ //console.log(d)
          return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("fill","black")

    var filtered = [];

    // Function by Andrew Reid
    // @link: https://bl.ocks.org/andrew-reid/64a6c1892d1893009d2b99b8abee75a7

    function updateLegend(d) {

      catInt = d3.select(catID).property('value');

      var newdata = data.filter(function(d){
        return d.Category == catInt;
      });

      d3.select(".clickThis").style("display","none")

      if (filtered.indexOf(d) == -1) {
        filtered.push(d);

        if(filtered.length == keysLegend.length) filtered = [];
      }

      else {
        filtered.splice(filtered.indexOf(d), 1);
      }

      var newKeys = [];
      keysLegend.forEach(function(d) {
        if (filtered.indexOf(d) == -1 ) {
          newKeys.push(d);
        }
      })

      x1.domain(newKeys).rangeRound([0, x0.bandwidth()]);

      y.domain([0, d3.max(newdata, function(d) {
        return d3.max(keysLegend, function(key) {
          if (filtered.indexOf(key) == -1)
            return +d[key];
          });
        })
      ]).nice();

      g.select(".axis--y")
        .transition()
        .duration(durations/1.5)
        .call(yAxis);

      var barsLegend = g.selectAll(".layer").selectAll("rect")
        .data(function(d) {
          return keysLegend.map(function(key) {
            return {key: key, value: d[key]};
          });
        })

      barsLegend.filter(function(d) {
           return filtered.indexOf(d.key) > -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("x", function(d) {
          return (+d3.select(this).attr("x")) +
                 (+d3.select(this).attr("width"))/2;
        })
        .attr("height",0)
        .attr("width",0)
        .attr("y", function(d) { return height; });

      barsLegend.filter(function(d) {
          return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("fill", function(d) { return z(d.key); });

      var barsLegendText = g.selectAll(".layer").selectAll("text")
        .data(function(d) {
          return keysLegend.map(function(key) {
            return {key: key, value: d[key]};
          });
        })

      barsLegendText.filter(function(d) {
           return filtered.indexOf(d.key) > -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("transform", function(d, i) {
          let x0 = x1.bandwidth() * i + 2,
              y0 = y(d.value) - 10;
          return "translate(" + x0 + "," + y0 + ") rotate(0)";
        })
        .text("");

      barsLegendText.filter(function(d) {
          return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("transform", function(d, i) {
          let x0 = x1.bandwidth() * i + 2,
              y0 = y(d.value) - 10;
          return "translate(" + x0 + "," + y0 + ") rotate(0)";
        })
        .text(function(d) {return formatValue(d.value)})

      g.selectAll(".barlegend")
        .transition()
        .duration(100)
        .attr("fill",function(d) {
          if (filtered.length) {
            if (filtered.indexOf(d) == -1) {
              return z(d);
            } else {
              return "white"; }
            } else {
            return z(d);
          }
        });

    } // End of updateLegend

    afterLoad();

  // End of ready
  });}
