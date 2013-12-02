var db = {};

db.load = function(map_id, user) {
  $.ajax({
    type: "POST",
    url: "http://zibi.openstreetmap.org.pl/yarl/db.php",
    data: "action=load&id="+map_id,
    success: function(out) {
      var items = jQuery.parseJSON(out);
      var text = '<h3>Obiekty na mapie</h3>';
      //console.log(items);
      
      L.geoJson(items.data, {
        onEachFeature: function(feature, layer){
          if (feature.properties) {
            if(feature.properties.popup)
              layer.bindPopup(feature.properties.popup);
          };
          
          text += '<div>';
          switch(feature.geometry.type) {
            case 'Point': text += '<i class="fa fa-map-marker"></i> '; break;
            case 'LineString': text += '<i class="fa fa-chevron-right"></i> '; break;
            case 'Polygon': text += '<i class="fa fa-square"></i> '; break;
          }
          
          text += feature.properties.popup+'</div>';
        }
      }).addTo(map);
      $('#tools .controls .fa-chevron-down').click();
      $('#tools .text').html(text);
    }
  });
};

db.save = function(data) {
  $.ajax({
    type: "POST",
    url: "http://zibi.openstreetmap.org.pl/yarl/db.php",
    data: "action=save&author="+auth.user_id+"&data="+encodeURIComponent(data),
    success: function(out) {
      alert(out);
    }
  });
}

$('#map-save').click(function() {
  console.log('a');
  db.save(JSON.stringify(map.getJSON()));
});