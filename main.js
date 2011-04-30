require("apejs.js");
require("googlestore.js");

require("./user.js");

// this happens before the handler
apejs.before = function(request, response) {
    // start the session
    var session = request.getSession(true);

    var userKey = session.getAttribute("userKey");

    // find user with this key and set an attribute
    var u = user.userByKey(userKey);
    request.setAttribute("user", u);
};

apejs.urls = {
    "/": {
        get: function(request, response) {
            // pass all this data to the skin
            var o = { 
                user: request.getAttribute("user")
            };
            require("./skins/index.js", o);

            response.getWriter().println(o.out);
        }
    }

};
