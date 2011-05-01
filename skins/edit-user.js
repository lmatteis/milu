require("./skins/header.js", this);
var u = _request.getAttribute("user");
this.out += '\
        <div id="link-form">\
			\
						\
			<h2 class="cabin">Modifica Account:</h2>\
			\
            <form method="post" enctype="multipart/form-data">\
				<p>\
					<label for="avatar">Avatar:</label>\
                    <input id="avatar" type="file" name="avatar">';

                    if(u.getProperty("avatarKey")) {
                        this.out +='<img src="/serve/<%=avatarKey.getId()%>.png" />';
                    } else {
                        this.out += '<img src="/images/default-avatar.png" />';
                    }

				this.out += '</p>\
				<p>\
					<label for="nome">Nome:</label>\
                    <input id="nome" type="text" name="name" value="'+u.getProperty("name")+'">\
				</p>\
				\
				<p class="last-p"><button type="submit">Modifica!</button></p>\
			</form>\
        </div><!-- /link-form -->\
';
require("./skins/footer.js", this);
