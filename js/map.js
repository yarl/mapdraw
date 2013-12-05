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

/* New map
-------------------------------------------------- */
map.loadNew = function() {
  map.editMode = true;
  map.addControl(drawControl);
  $(".leaflet-control-container>div>div.leaflet-draw").appendTo("#tools .edits").removeClass("leaflet-control");
  $("#tools .controls .fa-chevron-down").click();
  $('#tools .edits').addClass('divider');
  $('#tools .info').html('<input type="text" id="map-title" class="form-control divider" placeholder="Tytuł mapy">\
      <textarea id="map-desc" class="form-control divider" rows="2" placeholder="Opis mapy"></textarea>\
      <div class="btn-group" data-toggle="buttons"><label class="btn btn-default btn-sm active"><input type="radio">publiczna</label><label class="btn btn-default btn-sm"><input type="radio">prywatna</label></div>');
};

$('#tools .info').on('blur', '.form-control', function() {
  map.updateJSON();
});

$('#map-save').click(function() {
  db.save(JSON.stringify(db.info), JSON.stringify(map.getJSON()));
});

/* Draw
-------------------------------------------------- */
map.items = new L.FeatureGroup();
map.editToolbar = new L.EditToolbar.Edit(map, {featureGroup: map.items});
map.delToolbar = new L.EditToolbar.Delete(map, {featureGroup: map.items});
map.icon = L.AwesomeMarkers.icon({
  icon: 'null', prefix: 'fa', markerColor: 'cadetblue'
});

map.addLayer(map.items);

var drawControl = new L.Control.Draw({
  position: 'topright',
  draw: {
    polyline: {
      metric: true,
      shapeOptions: { color: '#436978' }
    },
    polygon: {
      allowIntersection: false, showArea: true,
      drawError: { color: '#b00b00', timeout: 1000 },
      shapeOptions: { color: '#436978' }
    },
    rectangle: { shapeOptions: { color: '#436978' }},
    circle: { shapeOptions: { color: '#436978' }},
    marker: { icon: map.icon }
  }
});

map.on('draw:created', function(e) {
  var layer = e.layer;
  map.nowEdit = layer;
  
  $('#helper').fadeIn();
  $('#helper .helper-colors .color-cadetblue').click();

  layer.on('click', function(e) {
    map.nowEdit = layer;
    $('#helper .popup-text').val(layer._popup === undefined ? "" : layer._popup.getContent());
    $('#helper').fadeIn('fast');
  });
   
  map.items.addLayer(layer);
  console.log(layer);
  map.updateJSON();
});

/* Helper
-------------------------------------------------- */
$('#helper .helper-colors label').click(function(){
    var color = $(this).attr('class');
      color = color.substring(17).replace(' active','');
    
    if(map.nowEdit instanceof L.Marker) {
      var icon = $.extend(true, {}, map.nowEdit.options.icon);
      icon.options.markerColor = color;
      map.nowEdit.setIcon(icon);
    } else {
      var color_;
      switch(color) {
        case 'red':         color_ = '#d63e2a'; break;
        case 'orange':      color_ = '#f69730'; break;
        case 'green':       color_ = '#72b026'; break;
        case 'blue':        color_ = '#38aadd'; break;
        case 'cadetblue':   color_ = '#436978'; break;
        case 'darkpurple':  color_ = '#5b396b'; break;
      }
      map.nowEdit.setStyle({color:color_});
    }
    
    map.updateJSON();
});

/**
 * Save popup text for object
 */
$('#helper .popup-save').click(function() {
    $('#helper .popup-text').val() === '' ?
      map.nowEdit.unbindPopup() :
      map.nowEdit.closePopup().bindPopup($('#helper .popup-text').val()).openPopup();
    map.updateJSON();
});

/**
 * Edit/move object
 */
$('#helper .popup-move').click(function() {
  if(map.nowEdit._popup !== null)
    map.nowEdit.closePopup();
  
  if($(this).attr('class').indexOf('active') === -1) {
    map.nowEdit.editing.enable();
  } else {
    map.nowEdit.editing.disable();
    map.updateJSON();
  }
});

/**
 * Delete object from map
 */
$('#helper .popup-delete').click(function() {
  map.items.removeLayer(map.nowEdit);
  $('#helper').fadeOut('fast');
  map.updateJSON();
});

map.on('draw:edited', function(e) {
  var layers = e.layers;
  var countOfEditedLayers = 0;
  layers.eachLayer(function(layer) {
    countOfEditedLayers++;
  });
  /*console.log("Edited " + countOfEditedLayers + " layers");*/
  map.updateJSON();
});

map.on('click', function(e) {
  if(map.editMode === true && map.nowEdit !== undefined) {
    map.editToolbar._disableLayerEdit(map.nowEdit);
    $('#helper').fadeOut('fast');
    $('#helper .popup-move').removeClass('active');
  }
});

/* JSON
-------------------------------------------------- */

map.loadJSON = function(items) {
  var text = '<h3>Obiekty na mapie</h3>';
  //console.log(items);

  L.geoJson(items.data, {
    /*pointToLayer: function (feature, latlng) {
      if(feature.properties.radius) {
        console.log(latlng);
        var o = L.circle(latlng, {
                radius: 1,
                color: feature.properties.color
        });
        o.setRadius(feature.properties.radius);
      } else return;
    },*/
    
    onEachFeature: function(feature, layer){
      text += '<div>';
      var color_;
      switch(feature.properties.color) {
        case 'red':         color_ = '#d63e2a'; break;
        case 'orange':      color_ = '#f69730'; break;
        case 'green':       color_ = '#72b026'; break;
        case 'blue':        color_ = '#38aadd'; break;
        case 'cadetblue':   color_ = '#436978'; break;
        case 'darkpurple':  color_ = '#5b396b'; break;
      }
      
      switch(feature.geometry.type) {
        case 'Point': 
          if(feature.properties.radius) {
            layer = new L.circle(feature.geometry.coordinates, feature.properties.radius);
            text += '<i class="fa fa-map-marker"></i> ';
          } else {
            layer.setIcon(L.AwesomeMarkers.icon({
              icon: 'null', prefix: 'fa', markerColor: feature.properties.color
            }));
            text += '<i class="fa fa-map-marker"></i> ';
          }
        break;
        case 'LineString':
          layer.setStyle({color:color_});
          text += '<i class="fa fa-chevron-right"></i> ';
        break;
        case 'Polygon':
          layer.setStyle({color:color_});
          text += '<i class="fa fa-square"></i> ';
        break;
      }

      text += feature.properties.popup+'</div>';
      
      if (feature.properties) {
        if(feature.properties.popup)
          layer.bindPopup(feature.properties.popup);
      };
      console.log(layer);
    }
  }).addTo(map);
  $('#tools .controls .fa-chevron-down').click();
  $('#tools .text').html(text);
};

/*
if(localStorage['map-data'] !== undefined) {
  var data = $.parseJSON(localStorage['map-data']);
  console.log('czytanie...');
  map.loadJSON(data);
}
     */

map.getJSON = function() {
  var out = new Object();
  var n = 0;
  map.items.eachLayer(function(layer) {
    out[n] = layer.toGeoJSON();
    out[n].properties = {
      popup: layer._popup === null || layer._popup === undefined ? 0 : layer._popup.getContent()
    };
    var prop = out[n].properties;
    
    if(layer instanceof L.Marker) prop.color = layer.options.icon.options.markerColor;
    else {
      var color_;
      switch(layer.options.color) {
        case '#d63e2a': color_ = 'red'; break;
        case '#f69730': color_ = 'orange'; break;
        case '#72b026': color_ = 'green'; break;
        case '#38aadd': color_ = 'blue'; break;
        case '#436978': color_ = 'cadetblue'; break;
        case '#5b396b': color_ = 'darkpurple'; break;
      }
      prop.color = color_;
    }
    if(layer instanceof L.Circle)
      prop.radius = layer.getRadius();
    
    ++n;
  });
  return out;
};

map.updateJSON = function() {
  db.info.title = $("#map-title").val();
  db.info.desc = $("#map-desc").val();
  var info = JSON.stringify(db.info);
  
  var json = JSON.stringify(map.getJSON());
  $('#testing').html(json+"<br />"+info);
  console.log(info);
  localStorage['map-data'] = json;
};