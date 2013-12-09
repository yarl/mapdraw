var Edit = function() {

    /**
     * Edit panel settings
     * @type L.Control.Draw
     */
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
        circle: false,
        marker: { icon: L.AwesomeMarkers.icon({
          icon: 'null', prefix: 'fa', markerColor: 'cadetblue'
        })}
      }
    });

    var init = function Foo() {
      map.items = new L.FeatureGroup();
      map.addLayer(map.items);
      
      /**
       * Information about currently edited map
       * @type type
       */
      this.mapInfo = {
        title : '',
        desc : '',
        created : '',
        lastedit : ''
      };
          
      /**
       * Strat editing map
       * @returns {undefined}
       */
      this.start = function() {
        map.editMode = true;
        map.addControl(drawControl);
        
        this.initToolbox();
        this.initHelper();
        
        /**
         * Add new item to map
         */
        map.on('draw:created', function(e) {
          var layer = e.layer;
          map.nowEdit = layer;
          
          $('#helper .popup-text').val('');
          $('#helper .helper-colors .color-cadetblue').click();
          $('#helper').show();
          
          /**
           * Click on item
           */
          layer.on('click', function(e) {
            map.nowEdit = layer;
            
            $('#helper .helper-colors .color-'+map.nowEdit.options.nowColor).click();
            $('#helper .popup-text').val(layer._popup === undefined ? "" : layer._popup.getContent());
            $('#helper').show();
          });

          map.items.addLayer(layer);
          map.items_[map.itemsCounter] = layer;
          map.itemsCounter++;
          map.updateJSON();
        });
      };
      
      /**
       * Init left/main toolbox
       * @returns {undefined}
       */
      this.initToolbox = function() {
        $(".leaflet-control-container>div>div.leaflet-draw").appendTo("#tools .edits").removeClass("leaflet-control");
        $("#tools .controls .fa-chevron-down").click();
        $('#tools .edits').addClass('divider');
        $('#tools .info').html('<input type="text" id="map-title" class="form-control divider" placeholder="Tytuł mapy">\
            <textarea id="map-desc" class="form-control divider" rows="2" placeholder="Opis mapy"></textarea>\
            <button id="map-privacy" type="button" class="btn btn-sm btn-default"><i class="fa fa-unlock-alt"></i> Udostępnianie: <strong>mapa publiczna</strong></button>');
        
        $('#tools .info').on('blur', '.form-control', function() {
          map.updateJSON();
        });
        
        $('#tools .info').on('click', '#map-privacy', function() {
          $('#modal .modal-title').html('Udostępnianie mapy');
          $('#modal .modal-body').html('<div class="btn-group">\
              <button type="button" class="btn btn-default">Publiczna</button>\
              <button type="button" class="btn btn-default">Dla wybranych</button>\
              <button type="button" class="btn btn-default">Prywatna</button>\
            </div>\
            <p>TODO: oskryptować, dodać pola kto może edytować (nikt/wszyscy/wybrani)</p>');
          $('#modal').modal();
          return false;
        });
        
        $('#tools .text').on('click', '.text-objects li', function() {
          var item = map.items_[($(this).attr('data-id'))];

          if(item instanceof L.Marker) map.setView(item.getLatLng());
          else map.setView(item.getBounds().getCenter());

          item.fire('click');
          return false;
        });
      };
      
      /**
       * 
       * @returns {undefined}
       */
      this.updateItemsList = function() {
        var text = '<ul class="text-objects">';
        //var n = 0;
        
        map.items.eachLayer(function(layer) {
          text += '<li data-id="'+map.items_.indexOf(layer)+'">';
          
          if(layer instanceof L.Marker) text += '<i class="tools-icon icon-marker"></i> ';
          else if(layer instanceof L.Polygon) text += '<i class="tools-icon icon-polygon"></i> ';
          else if(layer instanceof L.Rectangle) text += '<i class="tools-icon icon-rectangle"></i> ';
          else if(layer instanceof L.Polyline) text += '<i class="tools-icon icon-polyline"></i> ';
          
          text += layer._popup === undefined ? "<em>bez opisu</em>" : layer._popup.getContent();
          text += '</li>';
          
          //layer.bindPopup('Hello');
        });
        
        
        $('#tools .text').html(text);
      };
      
      /**
       * Init right/helper toolbox
       * @returns {undefined}
       */
      this.initHelper = function() {
        /**
         * Color selector
         */
        $('#helper .helper-colors label').click(function() {
          var color = $(this).attr('class');
            color = color.substring(17).replace(' active','');

          map.nowEdit.options.nowColor = color;
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
         * Popup text save
         */
        $('#helper .popup-save').click(function() {
          $('#helper .popup-text').val() === '' ?
            map.nowEdit.unbindPopup() :
            map.nowEdit.closePopup().bindPopup($('#helper .popup-text').val()).openPopup();
          map.updateJSON();
        });
        
        /**
         * Move object
         */
        $('#helper .popup-move').click(function() {
          if(map.nowEdit._popup !== null)
            map.nowEdit.closePopup();

          if($(this).attr('class').indexOf('active') === -1) {
            map.nowEdit instanceof L.Marker ? 
              map.nowEdit.dragging.enable() : 
              map.nowEdit.editing.enable();
          } else {
            map.nowEdit instanceof L.Marker ? 
              map.nowEdit.dragging.disable() : 
              map.nowEdit.editing.disable();
            map.updateJSON();
          }
        });
        
        map.on('draw:edited', function(e) {
          /*var layers = e.layers;
          var countOfEditedLayers = 0;
          layers.eachLayer(function(layer) { countOfEditedLayers++; });
          console.log("Edited " + countOfEditedLayers + " layers");*/
          map.updateJSON();
        });
        
        /**
         * Delete object
         */
        $('#helper .popup-delete').click(function() {
          map.items.removeLayer(map.nowEdit);
          $('#helper').hide();
          map.updateJSON();
        });
        
        map.on('click', function(e) {
          if(map.editMode === true && map.nowEdit !== undefined) {
            //editToolbar._disableLayerEdit(map.nowEdit);
            map.nowEdit instanceof L.Marker ? 
              map.nowEdit.dragging.disable() : 
              map.nowEdit.editing.disable();
            $('#helper').hide();
            $('#helper .popup-move').removeClass('active');
          }
        });
      };
      
      /**
       * Save map
       * @returns {undefined}
       */
      this.saveMap = function() {
        this.mapInfo.author = auth.user_id;
        db.save(JSON.stringify(this.mapInfo), JSON.stringify(map.getJSON()));
      };
      
      var this_ = this;
      $('#map-save').click(function() {
        this_.saveMap();
        return false;
      });
    };

    return init;
}();