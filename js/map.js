
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

map.itemsCounter = 0;
map.items_ = new Array();

var db = new Db();
var auth = new Auth();
var edit = new Edit();

/**
 * 
 * @param {type} data
 * @returns {undefined}
 */
map.loadMap = function(data) {
  var title = data.title.length == 0 ? "<em>bez nazwy</em>" : data.title;
  var desc = data.desc.length == 0 ? "<em>bez opisu</em>" : data.desc.replace(/#(\S+)/gm, '<a href="hashtag/\$1">#\$1</a>');
  var author = data.author_name;
  
  var text = '<h2>'+title+'</h2><p>'+desc+'</p><p>Autor: '+author+'</p><h3>Obiekty na mapie</h3>';
  text += '<ul class="text-objects">';

  var n = 0;
  L.geoJson(data.data, {
    onEachFeature: function(feature, layer) {
      var color_;
      switch(feature.properties.color) {
        case 'red':         color_ = '#d63e2a'; break;
        case 'orange':      color_ = '#f69730'; break;
        case 'green':       color_ = '#72b026'; break;
        case 'blue':        color_ = '#38aadd'; break;
        case 'cadetblue':   color_ = '#436978'; break;
        case 'darkpurple':  color_ = '#5b396b'; break;
      }

      text += '<li data-id="'+n+'">';
      map.items_[n] = layer;

      switch(feature.geometry.type) {
        case 'Point': 
          layer.setIcon(L.AwesomeMarkers.icon({
            icon: 'null', prefix: 'fa', markerColor: feature.properties.color
          }));
          text += '<i class="fa fa-map-marker"></i> ';
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

      text += feature.properties.popup+'</li>';
      n++;
      
      if (feature.properties) {
        if(feature.properties.popup)
          layer.bindPopup(feature.properties.popup);
      };
    }
  }).addTo(map.items);
  text += '</ul>';
  
  map.fitBounds(map.items.getBounds());
  
  $('#tools .text').on('click', '.text-objects li', function() {
    var item = map.items_[($(this).attr('data-id'))];
    
    if(item instanceof L.Marker) {
      map.setView(item.getLatLng());
    } else {
      map.setView(item.getBounds().getCenter());
    }
    
    if(item._popup !== undefined)
      item.openPopup();
    //console.log(map.items.getLayers());
    return false;
  });
  
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
      popup: layer._popup === null || layer._popup === undefined ? '' : layer._popup.getContent()
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
    ++n;
  });
  return out;
};

map.updateJSON = function() {
  edit.updateItemsList();
  edit.mapInfo.title = $("#map-title").val();
  edit.mapInfo.desc = $("#map-desc").val();
  var info = JSON.stringify(map.info);
  
  var json = JSON.stringify(map.getJSON());
  /*$('#testing').html(json+"<br />"+info);*/
  localStorage['map-data'] = json;
};