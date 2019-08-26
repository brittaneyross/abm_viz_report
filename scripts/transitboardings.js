// basic map
var mapboxAccessToken = 'pk.eyJ1Ijoic2FyYWhjbWFwIiwiYSI6ImNqc3VzMDl0YzJocm80OXBnZjc2MGk4cGgifQ.S_UmPA1jm5pQPrCCLDs41Q';
var lat = 41.8781;
var long = -87.6298;

var transitcenter = new L.LatLng(lat, long);

var map = new L.Map("map", {
    zoomControl: false,
    center: transitcenter,
    zoom: 8
});

var baselayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
})

$("a[href='#7']").on('shown.bs.tab',function(e) {
    map.invalidateSize();
});
map.addLayer(baselayer);


// settings for initial page load
var whichone = 'modshare'
var firsttime = true
drawmap()

// dropdown button events
function updateview(buttonarg) {
    if (buttonarg == 'Model') {
        whichone = 'modshare'
        difflegend.remove(map)
        legend.addTo(map)
        $("#transitsidebar").empty();
        movelegends("info legend leaflet-control")
        legend.remove(map)
    } else if (buttonarg == 'Survey') {
        whichone = 'surveysh'
        difflegend.remove(map)
        legend.addTo(map)
        $("#transitsidebar").empty();
        movelegends("info legend leaflet-control")
        legend.remove(map)
    } else if (buttonarg == 'Diff') {
        whichone = 'sharedif'
        legend.remove(map)
        difflegend.addTo(map)
        $("#transitsidebar").empty();
        movelegends("diff difflegend leaflet-control")
        difflegend.remove(map)
    }
    return whichone,
    updatemap();
}

$("#modelsurveygroup ul.dropdown-menu a").click(function () {
    $('#ModelSurvey').text($(this).text());
    updateview(($(this).text()));
});


// start mode button events
function updatemap() {
    map.eachLayer(function (layer) {
        if (![baselayer,cta,metra].includes(layer)) {
            map.removeLayer(layer);
    }});
    // lines overlays not showing even though they are checked...add and remove workaround
    if (map.hasLayer(cta)) {
        map.removeLayer(cta);
        map.addLayer(cta);
    }

    if (map.hasLayer(metra)) {
        map.removeLayer(metra);
        map.addLayer(metra);
    }
    firsttime = false
    drawmap();
}

function drawmap() {
var promise = $.getJSON("data/json/ringsectorswtransitboarding.json");
promise.then(function(data) {
    var pacestop = L.geoJson(data, {
        style:pacestyle,
        onEachFeature: function(feature, layer) {
            layer.on({
                'mouseover': highlightFeature,
                'mouseout': resetHighlightbus
            });
        }
    });
    var metrastop = L.geoJson(data, {
        style: metrastyle,
        onEachFeature: function(feature, layer) {
            layer.on({
                'mouseover': highlightFeature,
                'mouseout': resetHighlightmetra
            });
        }
    });
    var ctastop = L.geoJson(data, {
        style: ctastyle,
        onEachFeature: function(feature, layer) {
            layer.on({
                'mouseover': highlightFeature,
                'mouseout': resetHighlightcta
            });
        }
    });

    if (firsttime == true) {
        metrastop.addTo(map);
    }

    if (firsttime == false) {
        if ($("#cta").hasClass('btn-info')) {
            ctastop.addTo(map);
        } else if ($("#pace").hasClass('btn-info')) {
            pacestop.addTo(map);
        } else if ($("#metra").hasClass('btn-info')) {
            metrastop.addTo(map);
        }
    }

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {

        if (map.hasLayer(cta)) {
            cta.bringToFront();
        }

        if (map.hasLayer(metra)) {
            metra.bringToFront();
        }
    }

    $(document).on('click', '#metra', function() {
       $("#cta").removeClass('btn-info').addClass('btn-light')
       $("#pace").removeClass('btn-info').addClass('btn-light')
       if (!$(this).hasClass('btn-info')) {
        $('.btn').removeClass('btn-light')
        $(this).addClass('btn-info');
    }
        map.eachLayer(function (layer) {
            if (![baselayer,cta,metra].includes(layer)) {
                map.removeLayer(layer);
            }});
        map.addLayer(metrastop)

        if (map.hasLayer(cta)) {
            map.removeLayer(cta);
            map.addLayer(cta);
        }

        if (map.hasLayer(metra)) {
            map.removeLayer(metra);
            map.addLayer(metra);
        }

    });
    $(document).on('click', '#pace', function() {
        $("#cta").removeClass('btn-info').addClass('btn-light')
        $("#metra").removeClass('btn-info').addClass('btn-light')
        if (!$(this).hasClass('btn-info')) {
            $('.btn').removeClass('btn-light')
            $(this).addClass('btn-info');
        }
        map.eachLayer(function (layer) {
            if (![baselayer,cta,metra].includes(layer)) {
                map.removeLayer(layer);
            }});
        map.addLayer(pacestop)

        if (map.hasLayer(cta)) {
            map.removeLayer(cta);
            map.addLayer(cta);
        }

        if (map.hasLayer(metra)) {
            map.removeLayer(metra);
            map.addLayer(metra);
        }
    });
    $(document).on('click', '#cta', function() {
        $("#pace").removeClass('btn-info').addClass('btn-light')
        $("#metra").removeClass('btn-info').addClass('btn-light')
        if (!$(this).hasClass('btn-info')) {
            $('.btn').removeClass('btn-light')
            $(this).addClass('btn-info');
        }
        map.eachLayer(function (layer) {
            if (![baselayer,cta,metra].includes(layer)) {
            map.removeLayer(layer);
        }});
        map.addLayer(ctastop)

        if (map.hasLayer(cta)) {
            map.removeLayer(cta);
            map.addLayer(cta);
        }

        if (map.hasLayer(metra)) {
            map.removeLayer(metra);
            map.addLayer(metra);
        }

    });
});}
//end mode button events


//style
function pacestyle(feature) {
    if (whichone !== 'sharedif') {
    return {
        fillColor: getColor(parseFloat(feature.properties['b_' + whichone])),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    }}
    else {
        return {
            fillColor: getDiffColor(-parseFloat(feature.properties['b_' + whichone])),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }
    }
}

function ctastyle(feature) {
    if (whichone !== 'sharedif') {
        return {
            fillColor: getColor(parseFloat(feature.properties['c_' + whichone])),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }}
        else {
            return {
                fillColor: getDiffColor(-parseFloat(feature.properties['c_' + whichone])),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }
        }
    }

function metrastyle(feature) {
    if (whichone !== 'sharedif') {
        return {
            fillColor: getColor(parseFloat(feature.properties['m_' + whichone])),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }}
        else {
            return {
                fillColor: getDiffColor(-parseFloat(feature.properties['m_' + whichone])),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            }
        }
    }

// style: difference colors
function getColor(d) {
    return d > 20 ?  '	#0D263F' :
           d > 15  ? '#1C4E80' :
           d > 10  ?  '#4A729A	':
           d > 5   ?  '	#A6BACE	':
           '#EBF0F5';
}

function getDiffColor(d) {
    return d > 20 ?  '	#0D263F' :
    d > 15  ? '		#163E66' :
    d > 10  ? '#1C4E80' :
    d > 5   ?  '	#A6BACE	':
           d < -20  ? '#670000' :
           d < -15  ? '#910000' :
           d < -10  ? '#D00000' :
           d < -5   ? '#F8D0D0' :
           '#FAFCFF';
}


// info box
var info = L.control();

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};

info.update = function(props) {
    if (whichone !== 'sharedif') {
    this._div.innerHTML = '<h6>Share of Boardings</h6>' + (props ?
    '<b>' + 'ring sector: ' + props.ringsector + '</b><br />' + 'share: ' + getsharevalue(props)
    :'Hover over a ring sector');
}
    else {
    this._div.innerHTML = '<h6>Share Difference</h6><font size="2">(model - survey)</font><br>' + (props ?
        '<b>' + 'ring sector: ' + props.ringsector + '</b><br />' + 'difference: ' + getsharevalue(props)
        :'Hover over a ring sector');
    }
    };

function getsharevalue(props) {
    if (whichone !== 'sharedif') {
    if ($("#metra").hasClass("btn-info")) {
        var sharevalue = props['m_' + whichone]
    } else if ($("#pace").hasClass("btn-info")) {
        var sharevalue = props['b_' + whichone]
    } else if ($("#cta").hasClass("btn-info")) {
        var sharevalue = props['c_' + whichone]
    } else {
        var sharevalue = 0
    }}
    else {
        if ($("#metra").hasClass("btn-info")) {
            var sharevalue = -parseFloat(props['m_' + whichone])
        } else if ($("#pace").hasClass("btn-info")) {
            var sharevalue = -parseFloat(props['b_' + whichone])
        } else if ($("#cta").hasClass("btn-info")) {
            var sharevalue = -parseFloat(props['c_' + whichone])
        } else {
            var sharevalue = 0
    }}
    return sharevalue
};

info.addTo(map);

movelegends = function(elementtoremove) {
    var newParent = document.getElementById("transitsidebar");
    var oldParent = document.getElementsByClassName(elementtoremove)


    while (oldParent[0].childNodes.length > 0) {
        newParent.appendChild(oldParent[0].childNodes[0]);
    }
}

// legend
var legend = L.control({position: 'bottomright'});
var difflegend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,5,10,15,20],
    labels = [],
    from, to;

    for (var i=0; i< grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = "<h6>Percent</h6>" + labels.join('<br>');
    return div;
};

difflegend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'diff difflegend'),
    grades = [-20,-15,-10,-5,5,10,15,20],
    labels = [],
    from, to;

    for (var i=0; i< grades.length - 1; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getDiffColor(from + 1) + '"></i> ' +
            from + ' &ndash; ' + to);
    }
    div.innerHTML = "<h6>Share Difference</h6>" + labels.join('<br>');
    return div;
};

legend.addTo(map);


// highlight/unhighlight events
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();

        if (map.hasLayer(cta)) {
            cta.bringToFront();
        }

        if (map.hasLayer(metra)) {
            metra.bringToFront();
        }
    }
    info.update(layer.feature.properties);
}

var geojson;

function resetHighlightmetra(e) {
    var layer = e.target;

    layer.setStyle(
        metrastyle(layer.feature)
    );

    info.update();
}

function resetHighlightbus(e) {
    var layer = e.target;

    layer.setStyle(
        pacestyle(layer.feature)
    );

    info.update();
}

function resetHighlightcta(e) {
    var layer = e.target;

    layer.setStyle(
        ctastyle(layer.feature)
    );

    info.update();
}


// transit lines
var metra = L.geoJson(metradata, {
    color: '#696969',
    opacity: 0.8,
    weight: 2
});

var cta = L.geoJson(ctalines, {
    color: "black",
    opacity: 0.8,
    weight: 2
});

var overlayMaps = {
    "CTA lines": cta,
    "Metra lines": metra
};

var lines = L.control.layers(null, overlayMaps, {position: 'bottomleft'});

lines.addTo(map);

movelegends("info legend leaflet-control")
legend.remove(map)
