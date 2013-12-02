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
  $('#tools .controls').addClass('divider');
});

$('#tools').on('click', '.controls .fa-chevron-up', function(){
  $('#tools').removeClass('tools-max');
  $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
  $('#tools .controls').removeClass('divider');
});

/* Draw
-------------------------------------------------- */
map.items = new L.FeatureGroup();
map.addLayer(map.items);

var drawControl = new L.Control.Draw({
  position: 'topright',
  draw: {
    polyline: { metric: true },
    polygon: {
      allowIntersection: false, showArea: true,
      drawError: { color: '#b00b00', timeout: 1000 },
      shapeOptions: { color: '#bada55' }
    },
    circle: { shapeOptions: { color: '#662d91' } },
    marker: true
  },
  edit: { featureGroup: map.items, remove: false }
});

map.on('draw:created', function(e) {
  var type = e.layerType, layer = e.layer;
  map.nowEdit = layer;
  
  $('#helper').fadeIn();
  layer.on('click', function(e) {
    map.nowEdit = layer;
    $('#helper .popup-text').val(layer._popup === undefined ? "" : layer._popup.getContent());
    $('#helper').fadeIn();
  });
  
  map.items.addLayer(layer);
  map.updateJSON();
});

$('#helper .popup-save').click(function(){
    map.nowEdit.closePopup().bindPopup($('#helper .popup-text').val()).openPopup();
    $('#helper').fadeOut();
    map.updateJSON();
});

map.on('draw:edited', function(e) {
  var layers = e.layers;
  var countOfEditedLayers = 0;
  layers.eachLayer(function(layer) {
    countOfEditedLayers++;
  });
  console.log("Edited " + countOfEditedLayers + " layers");
  map.updateJSON();
});

/* JSON
-------------------------------------------------- */

map.getJSON = function(){
  var out = new Object();
  var n = 0;
  map.items.eachLayer(function(layer) {
    out[n] = layer.toGeoJSON();
    out[n].properties = {
      type: 0,
      popup: layer._popup === undefined ? 0 : layer._popup.getContent()
    };
    ++n;
  });
  return out;
};

map.updateJSON = function(){
  $('#testing').html(JSON.stringify(map.getJSON()));
};