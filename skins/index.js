require("./skins/header.js", this);
this.out += '<div class="order_filter">\
    <div id="tabs-answer-user" class="subtabs">\
        <a href="#" class="'+(_request.getParameter("sort") ? "" : "youarehere")+'">Ultime ricette</a>\
        <a href="#" class="'+(_request.getParameter("sort") ? "youarehere" : "")+'">Le più votate</a>\
    </div>\
    ';
this.out += '<select name="category">\
            <option>Categorie</option>';
for(var i=0; i<categories.length; i++) {
    var selected = "";
    if(this.recipe && categories[i] == this.recipe.getProperty("category"))
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
<div class="page_break"></div>';

require("./skins/footer.js", this);
