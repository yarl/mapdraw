<?php
session_start();

if(!isset($_SESSION['inicjuj'])) {
session_regenerate_id();
  $_SESSION['inicjuj'] = true;
  $_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
} if($_SESSION['ip'] != $_SERVER['REMOTE_ADDR']) {
  die('Niezgodność sesji!');      
} if(!isset($_SESSION['userid'])) {
  $_SESSION['userid'] = 0;
}

$root = "http://zibi.openstreetmap.org.pl/yarl/"; /*http://zibi.openstreetmap.org.pl/yarl*/
$map = isset($_GET['map']) ? $_GET["map"] : null;
?>
<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.png">
    <meta property="og:image" content="http://zibi.openstreetmap.org.pl/yarl/img/map.png" />
    <meta property="og:title" content="MapDraw" />
    <meta property="og:url" content="<?php echo $root ?>" />
    
    <title>MapDraw</title>
    <link href="<?php echo $root ?>libs/bootstrap.css" rel="stylesheet">
    <link href="<?php echo $root ?>libs/leaflet.css" rel="stylesheet"/>
    <link href="<?php echo $root ?>libs/leaflet.draw.css" rel="stylesheet"/>
    <link href="<?php echo $root ?>libs/leaflet.awesome-markers.css" rel="stylesheet"/>
    <!--[if lte IE 8]><link href="<?php echo $root ?>libs/leaflet.ie.css" rel="stylesheet"/><![endif]-->
    <!--[if lte IE 8]><link href="<?php echo $root ?>libs/leaflet.draw.ie.css" rel="stylesheet"/><![endif]-->
    <script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"></script>
    <script src="<?php echo $root ?>libs/leaflet.draw.js"></script>
    <script src="<?php echo $root ?>libs/leaflet.awesome-markers.js"></script>
    <script src="<?php echo $root ?>libs/osmauth.js"></script>
    <link href="<?php echo $root ?>style.css" rel="stylesheet">
    <link href='http://fonts.googleapis.com/css?family=Oxygen:400,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
    <link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>
    <div id="wrap">
      <div class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container">
          <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="."><img src="<?php echo $root ?>img/map.svg" alt="map_draw"/> map_draw</a>
          </div>
          <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <li id="about"><a href="#">O mapie</a></li>
              <!--
              <li><a data-toggle="dropdown" href="#">Dropdown trigger</a>
              <ul class="dropdown-menu" role="menu">
                <li>Lorem ipsum</li>
              </ul></li>
              <li><a href="#">Contact</a></li>
              <li><a id="save" href="#">Zapis</a></li>
              -->
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <?php 
                if(!empty($map) && $map === 'new') { echo '<li><a id="map-save" href="#">Zapisz</a></li>'; }
                else { echo '<li id="map-new"><a href="'.$root.'map/new">Utwórz nową mapę</a></li>'; }
              ?>
              <li class="dropdown" id="login-menu">
                <a href="#" id="login-in">Zaloguj</a>
              </li>
            </ul>
          </div><!--/.nav-collapse -->
          
        </div>
      </div>

      <!-- Begin page content -->
      <div class="container">
        <div id="tools" class="tools">
          <div class="controls">
            <i class="fa fa-plus fa-lg"></i>
            <i class="fa fa-minus fa-lg"></i>
            <i class="fa fa-location-arrow fa-lg"></i>
            <div class="pull-right"><i class="fa fa-chevron-down fa-lg"></i></div>
          </div>
          <div class="edits"></div>
          <div class="text"></div>
        </div>
        <div id="helper" class="tools out">
          <h3>Ustawienia obiektu</h3>
          <p>Kolor</p>
          <div class="btn-group helper-colors divider" data-toggle="buttons">
            <label class="btn btn-sm color-red"><input type="radio"> </label>
            <label class="btn btn-sm color-orange"><input type="radio"> </label>
            <label class="btn btn-sm color-green"><input type="radio"> </label>
            <label class="btn btn-sm color-blue"><input type="radio"> </label>
            <label class="btn btn-sm color-cadetblue"><input type="radio"> </label>
            <label class="btn btn-sm color-darkpurple"><input type="radio"> </label>
          </div>
          <div class="divider-noline">
            <p>Tekst</p>
            <textarea class="popup-text form-control divider"></textarea>
          </div>
          <button class="popup-save btn btn-success btn-sm" type="button"><i class="fa fa-check"></i> Zapisz</button>
          <button class="popup-move btn btn-sm" type="button" data-toggle="button"><i class="fa fa-arrows"></i> Przesuń</button>
          <button class="popup-delete btn btn-danger btn-sm pull-right" type="button"><i class="fa fa-times"></i> Usuń</button>
        </div>
        <div id="map"></div>
      </div>
    </div>

    <div id="footer">
      <div class="container">
        <p class="text-muted credit" id="testing"></p>
      </div>
    </div>
    
    <!-- Modal -->
    <div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
            <h4 class="modal-title"></h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Zamknij</button>
            <!--<button type="button" class="btn btn-primary">Save changes</button>-->
          </div>
        </div>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="<?php echo $root ?>libs/bootstrap.min.js"></script>
    <script src="<?php echo $root ?>js/db.js"></script>
    <script src="<?php echo $root ?>js/map.js"></script>
    <script src="<?php echo $root ?>js/auth.js"></script>
    <script>
      <?php 
        if(!empty($map)) {
          if($map == "new") { echo 'map.loadNew();'; }
          else { echo 'db.load("'.$map.'", "");'; }
        }
      ?>
    </script>
  </body>
</html>