// basic map
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';
var lat = 41.8781;
var long = -87.8298;

var map1 = new L.Map("hhvalidationmap", {
    zoomControl: false,
    center: new L.LatLng(lat, long),
    zoom: 8
});

var center = new L.LatLng(lat, long);

function zoomTo(location, map) {
	map.setView(location, 8);
	}

var baselayer1 = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
})

$("a[href='#11']").on('shown.bs.tab',function(e) {
    map1.invalidateSize();
});

map1.addLayer(baselayer1);

function highlightFeatureCounty1(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'black',
        dashArray: '',
        fillOpacity: 0,
    }); }

function resetHighlightCounty1(e) {
    var layer = e.target;

    layer.setStyle(
       countystyle1(layer.feature)
    );
    }

function countystyle1(feature) {
    return {
    weight: 2.5,
    fillOpacity: 0,
    color: 'black',
    dashArray: '',
    className: feature.properties.COUNTY
    };
}

var countiesmini = L.geoJSON(countiesdatamini, {
        style: countystyle1,
        interactive: false
            })
var baseLayers1 = {
    "Baselayer": baselayer1
  	};

var overlays1 = {
  "Counties": countiesmini
};


// control that shows state info on hover
	var info1 = L.control();

	info1.onAdd = function () {
		this._div = L.DomUtil.create('div', 'infoval');
		this.update();
		return this._div;
	};
  info1.update = function (props) {
		this._div.innerHTML =  (props ?
            '<table id="datatable"> <tr> <td style="width:105px">PUMA </td> <td>' + props.NAME_NEW + '</td> </tr> <tr> <td> Variable </td> <td>' + whichone_name1 + '</td> </tr> <tr> <td>Difference</td> <td>'+ Math.round((100*props[whichone1]) * 100) / 100 + ' p.p.' + '</td> </tr> <tr> <td>Model Count</td> <td>' + props[model_count_var1] +'</td> </tr> <tr> <td>Census Count</td> <td>' + props[census_count_var1] + '</td> </tr></table>'
			: 'Hover over a PUMA');
	};

	info1.addTo(map1);

// settings for initial page load
var whichone1 = 'difAU_0'
var whichone_name1 = 'Households with 0 vehicles'
var model_count_var1 = 'HHAU_0m'
var census_count_var1 = 'HHAU_0p'
var firsttime1 = true
drawmap1()


// dropdown button events
function updateview1(buttonarg) {
    if (buttonarg == '1-person households') {
        whichone1 = 'difSZ_1'
        model_count_var1 = 'HHSZ_1m'
        census_count_var1 = 'HHSZ_1p'
        whichone_name1 = '1-person households'
    }
    else if (buttonarg == '2-person households') {
        whichone1 = 'difSZ_2'
        model_count_var1 = 'HHSZ_2m'
        census_count_var1 = 'HHSZ_2p'
        whichone_name1 = '2-person households'
    }
    else if (buttonarg == '3-person households') {
        whichone1 = 'difSZ_3'
        model_count_var1 = 'HHSZ_3m'
        census_count_var1 = 'HHSZ_3p'
        whichone_name1 = '3-person households'
    }
    else if (buttonarg == '4+ person households') {
        whichone1 = 'difSZ_4'
        model_count_var1 = 'HHSZ_4m'
        census_count_var1 = 'HHSZ_4p'
        whichone_name1 = '4+ person households'
    }
    else if (buttonarg == 'Household income <35k') {
        whichone1 = 'difINC_1'
        model_count_var1 = 'HHINC_1m'
        census_count_var1 = 'HHINC_1p'
        whichone_name1 = 'Household income <35k'
    }
    else if (buttonarg == 'Household income 35k - 60k') {
        whichone1 = 'difINC_2'
        model_count_var1 = 'HHINC_2m'
        census_count_var1 = 'HHINC_2p'
        whichone_name1 = 'Household income 35k - 60k'
    }
    else if (buttonarg == 'Household income 60k - 100k') {
        whichone1 = 'difINC_3'
        model_count_var1 = 'HHINC_3m'
        census_count_var1 = 'HHINC_3p'
        whichone_name1 = 'Household income 60k - 100k'
    }
    else if (buttonarg == 'Household income > 100k') {
        whichone1 = 'difINC_4'
        model_count_var1 = 'HHINC_4m'
        census_count_var1 = 'HHINC_4p'
        whichone_name1 = 'Household income > 100k'
    }
    else if (buttonarg == '0-worker households') {
        whichone1 = 'difWK_0'
        model_count_var1 = 'HHWK_0m'
        census_count_var1 = 'HHWK_0p'
        whichone_name1 = '0-worker households'
    }
    else if (buttonarg == '1-worker households') {
        whichone1 = 'difWK_1'
        model_count_var1 = 'HHWK_1m'
        census_count_var1 = 'HHWK_1p'
        whichone_name1 = '1-worker households'
    }
    else if (buttonarg == '2-worker households') {
        whichone1 = 'difWK_2'
        model_count_var1 = 'HHWK_2m'
        census_count_var1 = 'HHWK_2p'
        whichone_name1 = '2-worker households'
    }
    else if (buttonarg == '3+ worker households') {
        whichone1 = 'difWK_3'
        model_count_var1 = 'HHWK_3m'
        census_count_var1 = 'HHWK_3p'
        whichone_name1 = '3+ worker households'
    }
    else if (buttonarg == 'Households with 0 vehicles') {
        whichone1 = 'difAU_0'
        model_count_var1 = 'HHAU_0m'
        census_count_var1 = 'HHAU_0p'
        whichone_name1 = 'Households with 0 vehicles'
    }
    else if (buttonarg == 'Households where # vehicles < # workers') {
        whichone1 = 'difAU_1'
        model_count_var1 = 'HHAU_1m'
        census_count_var1 = 'HHAU_1p'
        whichone_name1 = 'Households where # vehicles < # workers'
    }
    else if (buttonarg == 'Households where # vehicles >= # workers') {
        whichone1 = 'difAU_2'
        model_count_var1 = 'HHAU_2m'
        census_count_var1 = 'HHAU_2p'
        whichone_name1 = 'Households where # vehicles >= # workers'
    }
    return whichone1,
    updatemap1();
}

$('.dropdown-menu a').click(function () {
    updateview1(($(this).text()));
});


// start mode button events
function updatemap1() {
  map1.eachLayer(function (layer) {
      if (![baselayer1].includes(layer)){
          map1.removeLayer(layer);
  }});
    firsttime1 = false
    drawmap1();
}


function drawmap1() {
  L.geoJson(chicagoMapNew, {style: style1, onEachFeature: onEachFeature1}).addTo(map1);
  map1.addLayer(countiesmini)
}

function getDiffColor1(d) {
    return d > 15  ? '#1C4E80' :
    d > 10  ? '#4A729A' :
    d > 5  ?  '#8FA8C1':
           d < -15  ? '#D00000' :
           d < -10  ? '#DA3434' :
           d < -5   ? '#EE9C9C' :
           '#EBF0F5';
}

function style1(feature) {
    return {
        fillColor: getDiffColor1(100*feature.properties[whichone1]) ,
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '3',
        fillOpacity: 0.7
      };
}

function highlightFeaturePuma1(e) {
  var layer = e.target;

  layer.setStyle({
    weight: 5,
    color: 'orange',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
  info1.update(layer.feature.properties);
}

var geojson;
geojson = L.geoJson(chicagoMapNew, {style: style1});

function resetHighlightPuma1(e) {
  geojson.resetStyle(e.target);
  info1.update();
  if(map1.hasLayer(countiesmini)){
    countiesmini.bringToFront()
  }
}

function onEachFeature1(feature, layer) {
		layer.on({
			mouseover: highlightFeaturePuma1,
			mouseout: resetHighlightPuma1
		});
	}

var difflegend1 = L.control({position: 'bottomright'});
difflegend1.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'difflegend1'),
    grades = [-20,-15,-10,-5,5,10,15,20],
    labels = [],
    from, to;

    for (var i=0; i< grades.length-1; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + getDiffColor1(from + 1) + '"></i> ' +
            from + ' to ' + to)
    }
    div.innerHTML = "<h6>Difference</h6>" + labels.join('<br>');
    return div;
};

difflegend1.addTo(map1);
L.control.layers(baseLayers1,overlays1, {hideSingleBase:true}).addTo(map1);
