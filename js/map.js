map = new L.Map('map', {
  layers: [new L.TileLayer('http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {maxZoom: 20})],
  center: [localStorage['map-lat'] !== undefined ? localStorage['map-lat'] : 52.019,
          localStorage['map-lng'] !== undefined ? localStorage['map-lng'] : 20.676],
  zoom: localStorage['map-zoom'] !== undefined ? localStorage['map-zoom'] : 6,
  zoomControl: false,
  attributionControl: false
});

map.on('moveend', function(e){
  localStorage['map-lat'] = map.getCenter().lat;
  localStorage['map-lng'] = map.getCenter().lng;
  localStorage['map-zoom'] = map.getZoom();
});

/* Controls
-------------------------------------------------- */
$(".controls .fa-plus").click(function(){
  map.zoomIn();
});

$(".controls .fa-minus").click(function(){
  map.zoomOut();
});

$(".controls .fa-location-arrow").click(function(){
  map.locate({setView: true, maxZoom: 16});
});

$('#tools').on('click', '.controls .fa-chevron-down', function(){
  $('#tools').addClass('tools-max');
  $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
});

$('#tools').on('click', '.controls .fa-chevron-up', function(){
  $('#tools').removeClass('tools-max');
  $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
});

/******************************************************************************/
/********************************** DRAW **************************************/
map.items = new L.FeatureGroup();
map.addLayer(map.items);

var drawControl = new L.Control.Draw({
  position: 'topright',
  draw: {
    polyline: {
      metric: true
    },
    polygon: {
      allowIntersection: false,
      showArea: true,
      drawError: {
        color: '#b00b00',
        timeout: 1000
      },
      shapeOptions: {
        color: '#bada55'
      }
    },
    circle: {
      shapeOptions: {
        color: '#662d91'
      }
    },
    marker: true
  },
  edit: {
    featureGroup: map.items,
    remove: false
  }
});

map.getJSON = function(){
  var out = new Object();
  var n = 0;
  map.items.eachLayer(function(layer) {
    out[n] = layer.toGeoJSON();
    out[n].properties = {
      type: 0,
      popup: layer.getPopup() === undefined ? 0 : layer.getPopup().getContent()
    };
    ++n;
  });
  return out
};

map.showJSON = function(){
  $('#testing').html(JSON.stringify(map.getJSON()));
};

map.on('draw:created', function(e) {
  var type = e.layerType,
          layer = e.layer;

  $('#tools').show();
  map.nowEdit = layer;
  
  if (type === 'marker') {
    $('#tools .text').html('<input type="checkbox" name="popup">Dodaj podpis\
      <input type="text" name="popup-text"><br /><br />\
      <button type="button">Zastosuj</button>')
    //layer.bindPopup('A popup!');
  }

  map.items.addLayer(layer);
  map.showJSON();
});

$("#map-new a").click(function(){
  map.addControl(drawControl);
});

$('#tools .text').on('click', 'button[type=button]', function(){
  $("#tools input[name=popup]").is(':checked') ?
    map.nowEdit.bindPopup($('#tools input[name=popup-text]').val()) :
    map.nowEdit.unbindPopup();
    map.showJSON();
});


map.on('draw:edited', function(e) {
  var layers = e.layers;
  var countOfEditedLayers = 0;
  layers.eachLayer(function(layer) {
    countOfEditedLayers++;
  });
  console.log("Edited " + countOfEditedLayers + " layers");
  map.showJSON();
});

$('#save').click(function() {
  //console.log("action=save&author="+auth.user_id+"&data="+encodeURIComponent(JSON.stringify(map.items.toGeoJSON())));
  $.ajax({
    type: "POST",
    url: "db.php",
    data: "action=save&author="+auth.user_id+"&data="+encodeURIComponent(JSON.stringify(map.getJSON())),
    success: function(out) {
      alert(out);
    }
  });
});