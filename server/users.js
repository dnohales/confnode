/*
Meteor.publish("user-info", function(id) {
    return Meteor.users.find({_id: id}, {fields: {username: 1}});
});

*/
Meteor.publish("user-info", function(id) {
    return Meteor.users.find({_id: id}, {fields: {username: 1}});
});