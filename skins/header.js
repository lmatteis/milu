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
}

this.out += 'Il Grillo Mangiante</title> \
 \
<!-- just so dev is faster<link href=\'http://fonts.googleapis.com/css?family=Cabin:regular,bold\' rel="stylesheet" type="text/css">--> \
<link type="text/css" rel="stylesheet" href="/stylesheets/reset.css" /> \
<link type="text/css" rel="stylesheet" href="/stylesheets/main.css" /> \
 \
<script src="/js/mootools-yui-compressed.js"></script> \
<script src="/js/MooEditable.js"></script> \
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script> \
 \
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
		<ul> \
			<li>';
    this.out += '<a href="/">Home</a>\
                <span class="light">&bull;</span>';
var u;
if(u = _request.getAttribute("user")) {
    this.out += '<a href="/users/'+u.getKey().getId()+'">'+u.getProperty("username")+'</a>\
                <span class="light">&bull;</span> \
<a href="/add" id="newest_torrents">Inserisci Ricetta</a> \
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
		<a href="/" id="logo"><h1>Il Grillo Mangiante</h1></a> \
		<h2 class="cabin">Ricette di tutte le persone su questo mondo</h2> \
	</div>	\
	</div> \
 \
<div id="main-wrapper"> \
	<div id="main">';

