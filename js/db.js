var db = {};

db.load = function(map_id, user) {
  $.ajax({
    type: "POST",
    url: "db.php",
    data: "action=load&id="+map_id,
    success: function(out) {
      var items = jQuery.parseJSON(decodeURIComponent(out));
      //console.log(items);
      
      L.geoJson(items.data, {
        onEachFeature: function(feature, layer){
          if (feature.properties) {
            if(feature.properties.popup)
              layer.bindPopup(feature.properties.popup);
            
          };
        }
      }).addTo(map);
    }
  });
};

