require("./skins/header.js", this);
var u;
if(u = _request.getAttribute("user")) {
    this.out += "You're already logged in";
} else {
    this.out += '<div id="link-form">';
    if(this.error)
	    this.out += '<h2 class="cabin error">'+this.error+'</h2>';
    else
		this.out += '<h2 class="cabin">Login:</h2>';
			
    this.out +='<form action="/login" method="post">\
                <input type="hidden" name="returnurl" value="'+(_request.getParameter("returnurl") || "/")+'" />\
				<p>\
					<label for="username">Username:</label>\
                    <input id="username" type="text" name="username">\
				</p>\
				<p>\
					<label for="password">Password:</label>\
                    <input id="password" type="password" name="password" />\
				</p>\
				\
				<p class="last-p"><button type="submit">Login!</button></p>\
			</form>\
        </div><!-- /link-form -->\
        <p id="forgot-password"><a href="/forgot-password">Hai dimenticato la password?</a></p>\
        ';

}
require("./skins/footer.js", this);
