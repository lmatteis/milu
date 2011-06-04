$(function(){

    // add ... to recipe name if it's too long
    var $title = $(".recipe_list li a.title"),
        len = 23,
        title = $title.text().trim();
    if(title.length > len) {
        $title.text( title.substring(0, len) + "..." );
    }
});
