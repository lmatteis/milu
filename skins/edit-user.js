require("./skins/header.js", this);
var u = _request.getAttribute("user");

this.out += '<div id="link-form">';
if(this.error)
    this.out += '<h2 class="cabin error">'+this.error+'</h2>';
else
    this.out += '<h2 class="cabin">Modifica Account:</h2>';
			
            this.out+='<form method="post" enctype="multipart/form-data">\
				<p>\
					<label for="avatar">Avatar:</label>\
                    <input id="avatar" type="file" name="avatar">';

                    if(u.getProperty("imageKey")) {
                        this.out +='<img src="/serve/'+u.getProperty("imageKey").getId()+'.png" />';
                    } else {
                        this.out += '<img src="/images/default-avatar.png" />';
                    }

				this.out += '</p>\
				<p>\
					<label for="city">Città:</label>\
                    <input id="city" type="text" name="city" value="'+(u.getProperty("city") || "")+'">\
				</p>\
				<p>\
					<label for="bio">Su di me:</label>\
                    <textarea id="bio" name="bio">'+(u.getProperty("bio") || "")+'</textarea>\
				</p>\
                <h2 class="cabin">Cambia Password:</h2>\
				<p>\
					<label for="curr_password">Password corrente:</label>\
                    <input id="curr_password" type="password" name="curr_password">\
				</p>\
				<p>\
					<label for="new_password">Password nuova:</label>\
                    <input id="new_password" type="password" name="new_password">\
				</p>\
				\
				<p class="last-p"><button type="submit">Modifica!</button></p>\
			</form>\
        </div><!-- /link-form -->\
';
require("./skins/footer.js", this);
