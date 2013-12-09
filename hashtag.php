<?php
session_start();
$root = "http://zibi.openstreetmap.org.pl/yarl/";
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
    <script src="<?php echo $root ?>libs/osmauth.js"></script>
    <link href="<?php echo $root ?>style.css" rel="stylesheet">
    <link href='http://fonts.googleapis.com/css?family=Oxygen:400,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
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
            <a class="navbar-brand" href="<?php echo $root ?>"><img src="<?php echo $root ?>img/map.svg" alt="map_draw"/> map_draw</a>
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
                echo '<li id="map-new"><a href="'.$root.'map/new">Utwórz nową mapę</a></li>';
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
        <h2>funkcjonalność w opracowywaniu</h2>
      </div>
    </div>
    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="<?php echo $root ?>libs/bootstrap.min.js"></script>
    <script src="<?php echo $root ?>js/auth.js"></script>
    <script>var auth = new Auth();</script>
  </body>
</html>