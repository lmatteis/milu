require("./skins/header.js", this);

/*
this.out += '<script>\
$(function(){\
    \
    var resizeImg = function(){\
        var contWidth = $(".recipe-pic").width();\
        var contHeight = $(".recipe-pic").height();\
        var padWidth = contWidth*1.1;\
        var padHeight = contHeight*1.1;\
\
        var $this = $(this);\
\
        // find out which part to resize (only 1)\
        if($this.height() > $this.width()) { // resize only height\
            if($this.height() > (padHeight)) {\
                $this.css("height", padHeight);\
            }\
        } else {\
            if($this.width() > (padWidth)) {\
                $this.css("width", padWidth);\
            }\
        }\
\
        // now our image is proportionally resized\
        // lets position it\
\
        // move left only if width is bigger than container\
        if($this.width() > contWidth) {\
            var left = ($this.width() - contWidth) / 2;\
            $this.css("left", "-"+left+"px");\
        }\
\
        // move top only if height is bigger than container\
        if($this.height() > contHeight) {\
            var top = ($this.height() - contHeight) / 2;\
            $this.css("top", "-"+top+"px");\
        }\
        \
    };\
\
    $("#recipe_pic").load(resizeImg);\
    resizeImg.apply($("#recipe_pic").get(0));\
});\
</script>\
*/
this.out+='<div class="recipe">\
    <div class="recipe-left">\
        <div class="recipe-pic">\
            <a target="_blank" href="/serve/'+this.recipe.getProperty("fullImageKey").getId()+'.png"><img style="width:451px;" id="recipe_pic" src="/serve/'+this.recipe.getProperty("fullImageKey").getId()+'.png" /></a>\
        </div>\
        <div class="recipe-license">\
            <p>This work is licensed under a <a href="http://creativecommons.org/licenses/by-sa/3.0/" rel="external">Creative Commons Attribution-Share Alike 3.0 License</a></p>\
        </div>\
        <div class="recipe-content">\
            '+this.recipe.getProperty("content").getValue()+'\
        </div>\
        <div class="recipe-tags">\
        Tag: ';
        var count = 0;
        for(var i=0; i<this.tags.length; i++) {
            var tag = this.tags[i];
            if(count != 0)
                this.out += ",";
            count++;
            this.out += ' <a href="/search?q='+tag+'">'+tag+'</a>';
        }
        this.out += '</div>\
\
    </div><!--/recipe-left-->\
\
    <div class="recipe-right">';
        var user = _request.getAttribute("user");
        if(user && this.recipe.getProperty("userKey").equals(user.getKey())) {
            this.out += '<div class="recipe-edit"><a href="/edit-recipe/'+recipe.getKey().getId()+'">Modifica</a></div>';
        }
        this.out += '<h1>'+this.recipe.getProperty("title")+'</h1>\
        <span class="recipe-author">by <a href="/users/'+recipeAuthor.getKey().getId()+'">'+recipeAuthor.getProperty("username")+'</a></span>\
        <div class="recipe-ingredients">\
            <h3>Ingredienti:</h3>\
            <p>'+this.recipe.getProperty("ingredients").getValue()+'</p>\
        </div>\
        <div class="recipe-comments">\
            <h2><a name="comments"></a>Commenti</h2>';
    if(user) {
    this.out += '<form method="post" action="/add-comment">\
        <input type="hidden" name="recipeKeyString" value="'+KeyFactory.keyToString(this.recipe.getKey())+'"/>\
        <textarea name="comment"></textarea>\
        <input type="submit" value="Aggiungi commento" />\
    </form>';
    }
    for(var i=0; i<this.comments.length; i++) {
        var comment = this.comments[i];
        var author = googlestore.get(comment.getProperty("userKey"));

        this.out += '<div class="comment-box">\
                <div class="comment-author-pic">';
                    if(author.getProperty("imageKey")) {
                        this.out += '<a href="/users/'+author.getKey().getId()+'"><img src="/serve/'+author.getProperty("imageKey").getId()+'.png" /></a>';
                    } else { 
                        this.out += '<a href="/users/'+author.getKey().getId()+'">\
                            <img src="/images/default-avatar.png" />\
                        \
                        </a>';
                    }

                this.out +=' </div>\
                <div class="comment-author">\
                    <a href="/users/'+author.getKey().getId()+'">'+author.getProperty("username")+'</a>\
                </div>\
                <div class="comment-date">\
                    <a href="#">'+comment.getProperty("created")+'</a>\
                </div>\
                <div class="comment-itself">\
                <p>\
                '+comment.getProperty("comment").getValue().replaceAll("(\r\n)\\1+", "</p><p>").replaceAll("\r\n","<br />")+'\
                </p>\
                </div>\
\
            </div><!--/comment-box-->';
    }
        this.out +=' </div><!--/recipe-comments-->\
    </div><!--/recipe-right-->\
\
</div><!--/recipe-->';

require("./skins/footer.js", this);
