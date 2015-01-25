Meteor.methods({
    sendEmail: function(to, from, subject, text) {
        check([from, subject, text], [String]);
        check(to, Match.OneOf(String, Array))

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
            bcc: to,
            from: from,
            subject: subject,
            text: text
        });
    }
});