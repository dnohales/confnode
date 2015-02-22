Meteor.publish('rooms', function() {
    return Rooms.find();
});

Meteor.publish('userData', function() {
    if (this.userId) {
        return Meteor.users.find({
            _id: this.userId
        }, {
            fields: {
                'visitedRooms': 1
            }
        });
    } else {
        this.ready();
    }
});

Meteor.publish('user-info', function(id) {
    return Meteor.users.find({_id: id}, {fields: {username: 1}});
});