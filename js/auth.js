var auth = osmAuth({
  oauth_secret: 'JUNy2TwcwrFquo9e1Hn3ZOEnSrK0GTqVpeu2ehvx',
  oauth_consumer_key: 'gWiXsZSrjaPWkLpRakPc0pMo3EtUIzcCzyUK4XJB'
});

auth.user_id = 0;

auth.updateInfo = function() {
  if (auth.authenticated()) {
    auth.xhr({
      method: 'GET',
      path: '/api/0.6/user/details'
    }, auth.done);
  } else {
    $('#login-menu').removeClass("open");
    $('#login-menu').html('<a href="#" id="login-in">Zaloguj</a>');
    //map.removeControl(drawControl);
  }
};

auth.done = function(err, res) {
  if (err) {
    alert('error! try clearing your browser cache');
    return;
  }
  
  var u = res.getElementsByTagName('user')[0];
  var changesets = res.getElementsByTagName('changesets')[0];
  
  auth.display_name = u.getAttribute('display_name');
  auth.user_id = u.getAttribute('id');
  auth.changesets = changesets.getAttribute('count');
  
  //add menu
  $('#login-menu').html('<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+auth.display_name+'<b class="caret"></b></a>\
      <ul class="dropdown-menu">\
        <li><a href="#">Profil użytkowika</a></li>\
        <li><a href="#">Moje mapy</a></li>\
        <li class="divider"></li>\
        <li class="dropdown-header">Ustawienia</li>\
        <li><a href="#" id="login-out">Wyloguj</a></li>\
      </ul>');
};

$('#login-menu').on('click', '#login-in', function(){
  auth.authenticate(function() {
    auth.updateInfo();
  });
});
$('#login-menu').on('click', '#login-out', function(){
  auth.logout();
  auth.updateInfo();
});

auth.updateInfo();