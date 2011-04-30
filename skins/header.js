this.out = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"\
	"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"> \
 \
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"> \
<head> \
<meta http-equiv="content-type" content="text/html; charset=utf-8" />\
\
<title>Milu</title> \
 \
<!-- just so dev is faster<link href=\'http://fonts.googleapis.com/css?family=Cabin:regular,bold\' rel="stylesheet" type="text/css">--> \
<link type="text/css" rel="stylesheet" href="/stylesheets/reset.css" /> \
<link type="text/css" rel="stylesheet" href="/stylesheets/main.css" /> \
 \
<!--\
<%\
// avoid conflict with MooTools loaded under the add page\
if(!request.getRequestURI().equals("/add.jsp")) {\
%>\
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.4.3/jquery.min.js"></script> \
<% } %>\
-->\
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
if(this.user) {
    this.out += '<a href="/users/'+this.user+'">'+this.user+'</a>\
                <span class="light">&bull;</span> \
<a href="/add" id="newest_torrents">Inserisci Ricetta</a> \
                <span class="light">&bull;</span> \
 <a href="/logout?returnurl=<%=reqUri%>">Logout</a> \
';
} else {
    this.out +='<a href="/register?returnurl=<%=reqUri%>">Registrati</a> \
                <span class="light">&bull;</span> \
 <a href="/login?returnurl=<%=reqUri%>">Login</a> \
';
}
            this.out +='</li>			\
		</ul> \
		<a href="/" id="logo"><h1>Milù</h1></a> \
		<h2 class="cabin">Ricette di tutte le persone su questo mondo</h2> \
	</div>	\
	</div> \
 \
<div id="main-wrapper"> \
	<div id="main">';

