var Db = function() {
    var constructor = function Db() {
      
      /**
       * Map loading
       * @param String map_id
       */
      this.load = function(map_id) {
        $.ajax({
          type: "POST",
          url: "db.php",
          data: "action=load&id="+map_id,
          success: function(out) {
            if(out === "0") {
              $('#modal .modal-title').html('Brak mapy');
              $('#modal').modal();
              return false;
            }
            map.loadJSON($.parseJSON(out));
            return true;
          }
        });
      };
      
      /**
       * Map saving
       * @param JSON info
       * @param JSON data
       */
      this.save = function(info, data) {
        if(data === "{}") {
          $('#modal .modal-title').html('Błąd');
          $('#modal .modal-body').html('Brak danych do wysłania');
          $('#modal').modal();
          return false;
        }
        $.ajax({
          type: "POST",
          url: "db.php",
          data: "action=save&author="+auth.user_id+"&info="+encodeURIComponent(info)+"&data="+encodeURIComponent(data),
          success: function(out) {
            window.location.pathname = '/yarl/map/'+out;
          }
        });
      };
    };

    return constructor;
}();

