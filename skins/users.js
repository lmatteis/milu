require("./skins/header.js", this);

this.users.forEach(function(u) {
                out+='<div class="user-info">\
                  <div class="user-gravatar48">\
                    <a href="/users/'+u.getKey().getId()+'">';
                if(u.getProperty("imageKey")) {
                    out += '<img src="/serve/'+u.getProperty("imageKey").getId()+'.png" width="48" height="48" />';
                } else {
                    out += '<img src="/images/default-avatar.png" width="48" height="48"/>';
                }
                    out+='</a>\
                  </div>\
                  <div class="user-details">\
                      <a href="/users/'+u.getKey().getId()+'">'+u.getProperty("username")+'</a><br>                      \
                      <!--<span class="user-location">Rouen, France</span><br>-->\
                  </div>\
                </div>';
});
require("./skins/footer.js", this);
