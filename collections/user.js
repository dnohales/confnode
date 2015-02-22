Meteor.users.helpers = {
    addVisitedRoom: function(userId, roomId) {
        var rooms = Rooms.find({
            _id: roomId
        }, {
            _id: 1
        });
        if (rooms.count() === 0) {
            throw new Meteor.Error(422, 'Room does not exist');
        }

        var users = Meteor.users.find({
            $and: [{
                _id: userId
            }, {
                visitedRooms: {
                    $elemMatch: {
                        room_id: roomId
                    }
                }
            }]
        }, {
            _id: 1
        });

        if (users.count() === 0) {
            Meteor.users.update({
                _id: userId
            }, {
                $push: {
                    visitedRooms: {
                        when: new Date(),
                        room_id: roomId
                    }
                }
            });

            Rooms.update({
                _id: roomId
            }, {
                $inc: {
                    visits: 1
                }
            });
        }
    }
};

Meteor.methods({
    userAddVisitedRoom: function(roomId) {
        Meteor.users.helpers.addVisitedRoom(Meteor.userId(), roomId);
    },

    userUpdate: function(user) {
        validateUser(user);

        Meteor.users.update({
            _id: Meteor.userId()
        }, {
            $set: user
        });
    }
});

var validateUser = function(user) {
    check(user, {
        'profile.fullname': String,
        'profile.company': String,
        'profile.location': String,
        'profile.about': String,
        'profile.skills': Array,
        'profile.interests': Array,
        'profile.availability': {
            morning: Boolean,
            afternoon: Boolean,
            night: Boolean
        },
        'profile.timezone': String
    });
};