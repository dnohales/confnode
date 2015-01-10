function validateUser(user) {
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
}
Meteor.methods({
    userAddVisitedRoom: function(roomId) {
        var rooms = Rooms.find({
            _id: roomId
        }, {
            _id: 1
        });
        if (rooms.count() === 0) {
            throw new Meteor.Error(422, 'Room does not exists');
        }

        var users = Meteor.users.find({
            $and: [{
                _id: Meteor.userId()
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
                _id: Meteor.userId()
            }, {
                $push: {
                    visitedRooms: {
                        room_id: roomId,
                        when: new Date()
                    }
                }
            });
        }
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