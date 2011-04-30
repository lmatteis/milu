require("apejs.js");
require("googlestore.js");

apejs.urls = {
    "/": {
        get: function(request, response) {
            // load all damn recipes
            var o = { out: ""};
            require("./skins/index.js", o);

            response.getWriter().println(o.out);
        }
    }

};
