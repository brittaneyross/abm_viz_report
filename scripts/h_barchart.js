function makeGroupHBar(csv_file,chartID, nogroups,dataDescription,dtitle,height, word){

  var formatValue = d3.format(".2s");
  var barChartConfig = {
       mainDiv: "#chart",
       colorRange: ["#2a98cd", "#df7247"],
       xAxis: "runs",
       yAxis: "over",
       label: {
           xAxis: "Runs",
           yAxis: "Over"
       },
       requireLegend: true
   };

  var divText = document.getElementById(dataDescription);
  var divTitle = document.getElementById(dtitle);
  var ngroups= nogroups+1
  var formatValue = d3.format(".2s");
  var margin = {top: 35, right: 80, bottom: 100, left: 100},
    width = 400 - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

  var g = d3.select(chartID).append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 -10 350 960")
  .attr("align","center")
  .append("g")
  .attr("transform","translate(" + margin.left + "," + margin.top + ")");

  var div = d3.select("body").append("div")
  .attr("class", "vmttooltip2")
  .style("opacity", 0);

  // let x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1),
  //   x1 = d3.scaleBand(),
  //   y = d3.scaleLinear().rangeRound([height, 0]);

  var y0 = d3.scaleBand()
            .rangeRound([height, 0])
            .paddingInner(0.1);
  var y1 = d3.scaleBand()
            .padding(0.05);
  var x = d3.scaleLinear()
            .rangeRound([0, width]);

  //Review axis labels
  let xAxis = d3.axisBottom(x).ticks(5).tickFormat(d3.format(".2s")),
    yAxis = d3.axisLeft(y0).ticks(null, "s");

  g.append("g")
  .attr("class","axis axis--x")
  .attr("transform", "translate(0," + height + ")");

  g.append("g")
  .attr("class", "axis axis--y");

  var z = d3.scaleOrdinal()
  .range(["#0E84AC", "#548E3F"]);

  var durations = 0;

  let afterLoad = () => durations = 750;

  var catInt, keys, copy, sortIndex;

  var keysLegend = [];

  //catInt = d3.select(catID).property('value');


  //makeChart();
  d3.queue()
  .defer(d3.csv, csv_file, function(d, i, columns) {
    for(var i = 1, ttl = 0, n = columns.length; i < n; ++i)
          d.chartCat = d.Category;
          d.dataType = d.Type;
          d.descr = d.Description;
          d.title = d.Title;
          ttl += d[columns[i]] = +d[columns[i]];
          d.total = ttl
          d.M = parseInt(d.Model)
          d.S = parseInt(d.Survey)
          d.Model = d.M
          d.Survey = d.S
          return d;
  })
  .await(function(error, data){

    if (error) throw error;
    //d3.select(catID).on('change', update);
    // d3.select(checkBoxID).on('change', update); // Sort checkbox
    //catInt = d3.select(catID).property('value');

    init();
    update();

    function init() {
      sortIndex = data.map( function(d) {
        return d.Index
      } );
    }

    function update() {
      // ======== Initial/Sliced values ========
      //catInt = d3.select(catID).property('value');

      //console.log(newdata)
      //console.log(newdata);
      keys = data.columns.slice(1, ngroups); //Filter columns for Group Labels
      //console.log(keys)
      ////console.log(keys)
      copy = [];
      keys.forEach(function(t) {
        t = t.slice(0)    //Slice column label to select subgroup
        copy.push(t)
      })

      var copyKeys = keys;

      keysLegend = []

      copyKeys.forEach(function(s) {
        s = s.slice(0)  //Slice column label to select subgroup
        keysLegend.push(s)
      })

      //console.log(keysLegend)

      data.forEach(function(d, i, columns) {
        for (var i = 0, test = 0, n = keysLegend.length; i < n; ++i)
          test += d[keysLegend[i]];
          d.totalSlice = test;
          divText =  "Table Description: " + d.Description;
          divTitle =  d.Title;
        return d;
      })
      d3.select("#" + dataDescription).text(divText);
      d3.select("#" + dtitle).text(divTitle);
      // ======== Domain, Axis & Sort ========

      //console.log(newdata);

      x.domain([0, d3.max(data, function(d) {
        return d3.max(copy, function(key) {
          return +d[key];
          });
        })
      ]).nice();

      g.selectAll(".axis.axis--x").transition()
        .duration(durations)
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

      var barGroups = g.selectAll(".layer") // Bargroups initialized here for proper sorting
        .data(data, function(d) {
          return d.Index }); // DON'T FORGET KEY FUNCTION

      barGroups.enter().append("g")
        .classed('layer', true)
        .attr('line', function(d) {
          return d.Index;
        })

      barGroups.exit().remove();

      // newdata.sort( d3.select(checkBoxID).property("checked")
      //   ? function(a, b) {
      //     return b.totalSlice - a.totalSlice;
      //   }
      //   : function(a, b) {
      //     return sortIndex.indexOf(a.Index) - sortIndex.indexOf(b.Index);
      //   });


      y0.domain(data.map(function(d) { return d.Index; }));
      y1.domain(keys).rangeRound([0, y0.bandwidth()]);

      g.selectAll(".axis.axis--y").transition()
        .duration(durations)
        .call(yAxis);

      // ======== Grouped bars ========

      g.selectAll(".layer").transition().duration(durations)
        .attr("transform", function(d, i) {
          return "translate(0," + y0(d["Index"]) + ")";
        });

      let bars = g.selectAll(".layer").selectAll("rect")
        .data(function(d) {
          return copy.map(function(key) {
            return {
              key: key, value: d[key], lines: d.Index
            };
          });
        });

        bars = bars
          .enter()
          .append("rect")
          .attr("x", 0)
          .attr("y", function (d) {return y1(d.key)})
          .attr("width", function (d) {
            return x(d.value);})
          .attr("height", y1.bandwidth())
          .attr("fill", function(d) { return z(d.key); })
          .merge(bars)
          .on("mouseover", function(d) {
            div.transition()
            .duration(200)
            .style("opacity", .9);
            div.html(
              "<p style='color:#8a89a6; font-size: 20px; margin-bottom: 0px;'>" + d3.format(".4~s")(d.value) +
              "</p><p style='color:grey; font-size: 10px;'>" + word + "</p>"
              )
              .style("left", (d3.event.pageX) + "px")
              .style("top",  (d3.event.pageY - 28) + "px")


          d3.selectAll("." + d.lines.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, ""))
          .attr("fill", "#cf4446");
        selectedline = d.lines.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, "")
        // this highlights the line on the map!
        metra1.eachLayer(function(layer) {
          if(layer.LINE.includes(selectedline)){
            layer.setStyle({
              color:"#d7d55c",
              weight: 3
          })
          }})
        cta1.eachLayer(function(layer) {
          if(layer.LINE.includes(selectedline)){
            layer.setStyle({
              color:"#cf4446",
              weight: 3
          })
          }})

            })

        .on("mouseout", function(d) {
          div.transition()
          .duration(500)
          .style("opacity", 0);


          d3.selectAll("." + d.lines.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, ""))
            .attr("fill", function(d) {
            return z[1]; });
          selectedline = d.lines.replace(/\s/g, '').replace(/\//g,'-').replace(/&/g,'').replace(/\(|\)/g, "")
          // this highlights the line on the map!
          metra1.eachLayer(function(layer) {
            if(layer.LINE.includes(selectedline)){
              layer.setStyle({
                color:'#696969',
                weight: 2
            })
            }})
          cta1.eachLayer(function(layer) {
            if(layer.LINE.includes(selectedline)){
              layer.setStyle({
                color:"black",
                weight: 2
            })
            }})
            });

          bars.transition().duration(durations)
            .attr("x", 0)
            .attr("width", function(d) {
              return x(d["value"]);
            });

      // ======== Grouped bar text ========

      // let textOnBar = g.selectAll(".layer").selectAll("text")
      //   .data(function(d) {
      //     return copy.map(function(key) {
      //       return {key: key, value: d[key]};
      //     });
      //   });
      //
      // textOnBar = textOnBar
      //   .enter()
      // .append("text")
      //   .attr("fill","#fff")
      //   .attr("font-size",11)
      //   .merge(textOnBar);
      //
      // textOnBar.transition().duration(durations)
      //   .attr("transform", function(d, i) {
      //     let y0 = y1.bandwidth() * i + 7,
      //         x0 = x(d.value) + 8;
      //     return "translate(" + y0 + "," + x0 + ") rotate(90)";
      //   })
      //   .text(function(d) {return formatValue(d.value)})

      // ======== Legend rects ========

      // var legend = g.selectAll(".legend")
      //   .data(keysLegend);

      // legend = legend
      //   .enter()
      // .append("rect")
      //   .attr("class","barlegend")
      //   .attr("transform", function(d, i) {
      //     return "translate(0," + i * 40 + ")";
      //   })
      //   .attr("x", width + 17) //location of legend
      //   .attr("width", 15)
      //   .attr("height", 15)
      //   .attr("stroke-width",2)
      //   .merge(legend)

      // legend.transition().duration(durations)
      //   .attr("fill", z)
      //   .attr("stroke", z);

      // // ======== Legend text ========

      // var legendText = g.selectAll(".legendText")
      //   .data(keysLegend);

      // legendText = legendText
      //   .enter()
      //   .append("text")
      //   .attr("class","legendText")
      //   .attr("transform", function(d, i) {
      //     return "translate(0," + i * 40 + ")";
      //   })
      //   .attr("x", width + 40)
      //   .attr("font-size",12)
      //   .attr("y", 8)
      //   .attr("dy", "0.32em")
      //   .merge(legendText);

      // legendText.transition().duration(durations)
      //   .text(function(d) {
      //     var sliceLegend = d.slice(0, -1)
      //     return sliceLegend;
      //   });

    } // End of update function

    var filtered = [];

    // Function by Andrew Reid
    // @link: https://bl.ocks.org/andrew-reid/64a6c1892d1893009d2b99b8abee75a7

    function updateLegend(d) {

      //catInt = d3.select(catID).property('value');

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

      y1.domain(newKeys).rangeRound([0, y0.bandwidth()]);

      x.domain([0, d3.max(data, function(d) {
        return d3.max(keysLegend, function(key) {
          if (filtered.indexOf(key) == -1)
            return d[key];
          });
        })
      ]).nice();

      g.select(".axis--x")
        .transition()
        .duration(durations/1.5)
        .call(xAxis);

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
        .attr("y", function(d) {
          return (+d3.select(this).attr("y")) +
                 (+d3.select(this).attr("hieght"))/2;
        })
        .attr("height",0)
        .attr("width",0)
        .attr("x", function(d) { return width; });

      barsLegend.filter(function(d) {
          return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("y", function(d) { return y1(d.key); })
        .attr("x", function(d) { return x(d.value); })
        .attr("width", function(d) { return width - x(d.value); })
        .attr("height", y1.bandwidth())
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
          let y0 = y1.bandwidth() * i + 7,
              x0 = x(d.value) + 8;
          return "translate(" + y0 + "," + x0 + ") rotate(90)";
        })
        .text("");

      barsLegendText.filter(function(d) {
          return filtered.indexOf(d.key) == -1;
        })
        .transition()
        .duration(durations/1.5)
        .attr("transform", function(d, i) {
          let y0 = y1.bandwidth() * i + 7,
              x0 = x(d.value) + 8;
          return "translate(" + y0 + "," + x0 + ") rotate(90)";
        })
        .text(function(d) {return formatValue(d.value)})

      g.selectAll(".legend")
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
