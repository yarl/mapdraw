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
?>
<!DOCTYPE html>
<html lang="pl">
  <head>
    <?php $root = "http://localhost/mapdraw/" /*http://zibi.openstreetmap.org.pl/yarl*/ ?> 
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.png">
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
              <li id="map-new"><a href="#">Utwórz nową mapę</a></li>
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
          <div class="divider"></div>
          <div class="text">test</div>
        </div>
        <div id="map"></div>
      </div>
    </div>

    <div id="footer">
      <div class="container">
        <p class="text-muted credit" id="testing"></p>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="<?php echo $root ?>libs/bootstrap.min.js"></script>
    <script src="<?php echo $root ?>js/db.js"></script>
    <script src="<?php echo $root ?>js/map.js"></script>
    <script src="<?php echo $root ?>js/auth.js"></script>
    <script>
      <?php 
        if(!empty($_GET["map"]))
          echo 'db.load("'.$_GET["map"].'", "");'
      ?>
    </script>
  </body>
</html>