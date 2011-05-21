importPackage(java.util);
importPackage(javax.mail);
importPackage(javax.mail.internet);

var sendemail = {
    fromEmail: "lmatteis@gmail.com",
    fromName: "Cucinarsi.it",
    send: function(toEmail, toName, toSubject, toBody) {
        var props = new Properties(),
            session = Session.getDefaultInstance(props, null);

        try {
            var msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(this.fromEmail, this.fromName));
            msg.addRecipient(Message.RecipientType.TO,
                             new InternetAddress(toEmail, toName));
            msg.setSubject(toSubject);
            msg.setText(toBody);
            Transport.send(msg);

        } catch (e) {
            if(e.javaException instanceof AddressException) {
                throw new Exception("Indirizzo email inesistente");
            } else if(e.javaException instanceof MessagingException) {
                throw new Exception(e.javaException.getMessage());
            }
        }
    }
};

