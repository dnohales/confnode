Permissions = {
    // Check whether user is logged in
    isLoggedIn: function(userId) {
        return !! userId;
    },

    // Check that the userId specified owns the documents
    ownsDocument: function(userId, doc) {
        return doc && doc.userId === userId;
    }
};
