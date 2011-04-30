importPackage(java.security);
importPackage(java.lang);

var usermodel = {
    exists: function(email) {
        var q = googlestore.query("user");
        q.addFilter("email", "=", email);
        var result = q.fetch(1);
        if(result.length)
            return true;
        else 
            return false;
    },
    validateEmail: function(email){ 
         var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         return email.match(re);
    },
    // makes a sha1 string out of a string
    sha1: function(text) {
        function bytesToHex(b) {
            var hexDigit = ['0', '1', '2', '3', '4', '5', '6', '7',
                         '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
            var buf = new StringBuffer();
            for (var j=0; j<b.length; j++) {
                buf.append(hexDigit[(b[j] >> 4) & 0x0f]);
                buf.append(hexDigit[b[j] & 0x0f]);
            }
            return buf.toString();
        }
        var md = MessageDigest.getInstance("SHA-1");
        md.update(text.getBytes("iso-8859-1"), 0, text.length());
        var sha1hash = md.digest();
        return bytesToHex(sha1hash);
    }
};