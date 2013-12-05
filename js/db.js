var db = {};
db.info = {};

db.load = function(map_id, user) {
  $.ajax({
    type: "POST",
    url: "http://zibi.openstreetmap.org.pl/yarl/db.php",
    data: "action=load&id="+map_id,
    success: function(out) {
      if(out === "0") {
        $('#modal .modal-title').html('Brak mapy');
        $('#modal').modal();
        return;
      }
      map.loadJSON($.parseJSON(out));
      return;
    }
  });
};

db.save = function(info, data) {
  $.ajax({
    type: "POST",
    url: "http://zibi.openstreetmap.org.pl/yarl/db.php",
    data: "action=save&author="+auth.user_id+"&info="+encodeURIComponent(info)+"&data="+encodeURIComponent(data),
    success: function(out) {
      alert(out);
    }
  });
};