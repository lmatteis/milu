$(function(){

    // remove all empty p's
    $(".recipe-content p, .ingredients-content p").each(function() {
        var $this = $(this);
        if (/^\s+$/.test($this.text())) //string contains only whitespace
            $this.remove();
    });

    // wrap images in links
    $(".recipe-content img, .ingredients-content img").each(function() {
        var $this = $(this),
            link = $this.attr("src"),
            a = $("<a target='_blank'></a>");

        a.attr("href", link);
        a.append($this.clone());

        console.log(a);
        $this.replaceWith(a);
    });



});
