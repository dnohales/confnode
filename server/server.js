process.env.MAIL_URL = "smtp://conf.node%40gmail.com:tesiscaece2014@smtp.gmail.com:465/";

chatStream = new Meteor.Stream('chat');

chatStream.permissions.write(function() {
    return true;
});

chatStream.permissions.read(function() {
    return true;
});