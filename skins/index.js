require("./skins/header.js", this);
this.out += '<div class="order_filter">\
    <div id="tabs-answer-user" class="subtabs">\
        <a href="/'+(_request.getParameter("cat") ? "?cat="+_request.getParameter("cat") : "")+'" class="'+(_request.getParameter("likes") ? "" : "youarehere")+'">Ultime ricette</a>\
        <a href="/?likes=true'+(_request.getParameter("cat") ? "&cat="+_request.getParameter("cat") : "")+'" class="'+(_request.getParameter("likes") ? "youarehere" : "")+'">Le più votate</a>\
    </div>\
    ';
this.out += '<select id="cat" name="category">\
            <option>Categorie</option>';
for(var i=0; i<categories.length; i++) {
    var selected = "";
    if(_request.getParameter("cat") == categories[i])
        selected = "selected";

    this.out += '<option '+selected+' value="'+categories[i]+'">'+categories[i]+ '</option>';
}
this.out += '</select>\
            </div><!-- /order_filter-->';

this.out += '<ul class="recipe_list large">';
var counter = 0;
for(var i=0; i<this.recipes.length; i++) {
    var recipe = this.recipes[i];
    if(counter == 4) counter = 0;
    counter++;

    var recipeUser = googlestore.get(recipe.getProperty("userKey"));

    var comments = googlestore.query("comment")
            .filter("recipeKey", "=", recipe.getKey())
            .fetch();

    this.out += '<li class="'+(counter == 4 ? "last":"")+'" style="background: url(/serve/'+recipe.getProperty("thumbKey").getId()+'.png) no-repeat;" alt="'+recipe.getProperty("title")+'">\
        <a class="image" href="/recipes/'+recipe.getKey().getId()+'">\
        </a>\
        <div class="owner">\
            <h2><a title="'+recipe.getProperty("title")+'" class="title" href="/recipes/'+recipe.getKey().getId()+'">\
                '+recipe.getProperty("title")+'\
            </a></h2>\
            <cite>\
                di <a href="/users/'+recipeUser.getKey().getId()+'">'+recipeUser.getProperty("username")+'</a>\
                <em class="recipe_stats"><span class="recipe_stats_comment">'+comments.length+'</span> </em>\
            </cite>\
        </div>\
    </li>\
';
}
this.out +='</ul>\
<div class="page_break" style="clear: both"></div>';

this.out += '<div class="lsbb" style="border-left:1px solid #ccc;text-align:center;width:320px;height:30px"><input class="lsb" id="smb" style="width:320px !important;background-repeat:repeat-x;padding:0" type="button" value="Altri risultati"></div>';

require("./skins/footer.js", this);
