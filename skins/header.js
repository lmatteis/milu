this.VERSION = "6"; // change this to refresh static content. I know what a fucking hack right?
var categories = ["Antipasti - Buffet - Sfizi", "Pane - Pizza - Torte rustiche", "Primi piatti", "Secondi piatti", "Contorni", "Frutta", "Dolci", "Cocktail - Bevande"];

this.out = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"\
	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"> \
 \
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"> \
<head> \
<meta http-equiv="content-type" content="text/html; charset=utf-8" />\
\
<title>';

// set the title of the recipe as title of html page
if(this.recipe) {
    this.out += this.recipe.getProperty("title") + " | ";
} else {
    this.out += "Crea e condividi le tue ricette | ";
}

this.out += 'Il Grillo Mangiante</title> \
 \
<link type="text/css" rel="stylesheet" href="/stylesheets/reset.css?'+this.VERSION+'" /> \
<link type="text/css" rel="stylesheet" href="/stylesheets/main.css?'+this.VERSION+'" /> \
<link href="http://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet" type="text/css">\
 \
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script> \
<script type="text/javascript" src="/js/ui.js?'+this.VERSION+'"></script> \
<script type="text/javascript">\
\
  var _gaq = _gaq || [];\
  _gaq.push(["_setAccount", "UA-3942737-3"]);\
  _gaq.push(["_trackPageview"]);\
\
  (function() {\
    var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;\
    ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";\
    var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);\
  })();\
\
</script>\
</head> \
<body id="home"> \
	\
<div id="wrapper"> \
	<div id="header-bar"> \
		<div id="one"></div> \
		<div id="two"></div> \
		<div id="three"></div> \
		<div id="four"></div> \
		<div id="five"></div> \
	</div> \
	\
	<div id="header-wrapper">	\
	<div id="header"> \
        <div id="nav_search">\
            <ul> \
                <li>';
        this.out += '<a href="/">Home</a><span class="light">&bull;</span><a href="/users">Utenti</a>\
                    <span class="light">&bull;</span>';
    var u;
    if(u = _request.getAttribute("user")) {
        this.out += '<a href="/users/'+u.getKey().getId()+'">Profilo</a>\
                    <span class="light">&bull;</span> \
     <a href="/logout?returnurl='+_request.getRequestURI()+'">Logout</a> \
    ';
    } else {
        this.out +='<a href="/register?returnurl='+_request.getRequestURI()+'">Registrati</a> \
                    <span class="light">&bull;</span> \
     <a href="/login?returnurl='+_request.getRequestURI()+'">Login</a> \
    ';
    }
                this.out +='</li>			\
            </ul> \
            <div class="search">\
<form action="/search" id="cse-search-box">\
  <div>\
    <input type="hidden" name="cx" value="013135011952329865909:f3l43vc3uru" />\
    <input type="hidden" name="cof" value="FORID:10" />\
    <input type="hidden" name="ie" value="UTF-8" />\
    <input type="text" name="q" size="31" placeholder="Cerca..."/>\
    <input type="submit" style="display: none;" name="sa" value="Cerca" />\
  </div>\
</form>\
            </div>\
        </div><!--/nav_search-->\
		<a href="/" id="logo"><h1>Il Grillo Mangiante</h1></a> \
		<h2 class="cabin">Crea e condividi le tue ricette</h2> \
	</div>	\
	</div> \
 \
<div id="main-wrapper"> \
	<div id="main">';

