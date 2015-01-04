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
    }
});