var user = {
    userByKey: function(userKey) {
        user = googlestore.getObjectByKey("user", userKey);
        return user;
    }
};
