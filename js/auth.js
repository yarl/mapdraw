var Auth = function()
{
    var osmauth = osmAuth({
      oauth_secret: 'JUNy2TwcwrFquo9e1Hn3ZOEnSrK0GTqVpeu2ehvx',
      oauth_consumer_key: 'gWiXsZSrjaPWkLpRakPc0pMo3EtUIzcCzyUK4XJB'
    });
    
    var init = function Auth() {
      //detault user ID
      this.user_id = 0;
      
      /**
       * Check if logged in
       * @returns {undefined}
       */
      this.check = function() {
        if(osmauth.authenticated()) {
          osmauth.xhr({
            method: 'GET',
            path: '/api/0.6/user/details'
          }, this.logIn);
        } else this.logOut();
      };
      
      /**
       * Log in
       * @param {type} err
       * @param {type} res
       * @returns {undefined}
       */
      var this_ = this;
      this.logIn = function(err, res) {
        if(err) {
          alert('error! try clearing your browser cache');
          return;
        }

        var u = res.getElementsByTagName('user')[0];
        var changesets = res.getElementsByTagName('changesets')[0];

        this_.display_name = u.getAttribute('display_name');
        this_.user_id = u.getAttribute('id');
        //changesets.getAttribute('count');

        //add menu
        $('#login-menu').html('<a href="#" class="dropdown-toggle" data-toggle="dropdown">'+this_.display_name+'<b class="caret"></b></a>\
            <ul class="dropdown-menu">\
              <li><a href="user/'+this_.user_id+'">Profil użytkowika</a></li>\
              <li><a href="user/'+this_.user_id+'">Moje mapy</a></li>\
              <li class="divider"></li>\
              <li class="dropdown-header">Ustawienia</li>\
              <li><a href="#" id="login-out">Wyloguj</a></li>\
            </ul>');
      };

      /**
       * Log out
       * @returns {undefined}
       */
      this.logOut = function() {
        osmauth.logout();
        $('#login-menu').removeClass("open");
        $('#login-menu').html('<a href="#" id="login-in">Zaloguj</a>');
      };
      
      var this_ = this;
      $('#login-menu').on('click', '#login-in', function() {
        osmauth.authenticate(function() {
          this_.check();
        });
        return false;
      });
      $('#login-menu').on('click', '#login-out', function() {
        this_.logOut();
        return false;
      });

      this.check();
    };

    return init;
}();