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
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="favicon.png">
    <title>MapDraw</title>
    <link href="libs/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="libs/leaflet.css" />
    <!--[if lte IE 8]><link rel="stylesheet" href="libs/leaflet.ie.css" /><![endif]-->
    <link rel="stylesheet" href="libs/leaflet.draw.css" />
    <!--[if lte IE 8]><link rel="stylesheet" href="libs/leaflet.draw.ie.css" /><![endif]-->
    <script src="http://cdn.leafletjs.com/leaflet-0.7/leaflet.js"></script>
    <script src="libs/leaflet.draw.js"></script>
    <script src="libs/osmauth.js"></script>
    <link href="style.css" rel="stylesheet">
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
            <a class="navbar-brand" href="#">/name/</a>
          </div>
          <div class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
              <li><a href="#">About</a></li>
              <li><a href="#">Contact</a></li>
              <li><a id="save" href="#">Zapis</a></li>
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
        <div id="tools"></div>
        <div id="map"></div>
      </div>
    </div>

    <div id="footer">
      <div class="container">
        <p class="text-muted credit" id="testing"></p>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="libs/bootstrap.min.js"></script>
    <script src="js/db.js"></script>
    <script src="js/map.js"></script>
    <script src="js/auth.js"></script>
    <script>
      <?php 
        if(!empty($_GET["map"]))
          echo 'db.load("'.$_GET["map"].'", "");'
      ?>
    </script>
  </body>
</html>