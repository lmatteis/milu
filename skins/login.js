require("./skins/header.js", this);
var u;
if(u = _request.getAttribute("user")) {
    this.out += "You're already logged in";
} else {
    this.out += '<div id="link-form">';
    if(this.error)
	    this.out += '<h2 class="cabin error">'+this.error+'</h2>';
    else
		this.out += '<h2 class="cabin">Registrati:</h2>';
			
    this.out +='<form action="/login" method="post">\
                <input type="hidden" name="returnurl" value="'+_request.getParameter("returnurl")+'" />\
				<p>\
					<label for="email">Email:</label>\
                    <input id="email" type="text" name="email">\
				</p>\
				<p>\
					<label for="password">Password:</label>\
                    <input id="password" type="password" name="password" />\
				</p>\
				\
				<p class="last-p"><button type="submit">Login!</button></p>\
			</form>\
        </div><!-- /link-form -->\
        ';

}
require("./skins/footer.js", this);
