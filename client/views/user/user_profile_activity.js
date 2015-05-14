Template.userProfileActivity.helpers({
    visitedRooms: function() {
        var rooms = _.map(this.profile.visitedRooms, _.clone);
        var i;
        for (i=0; i<rooms.length; i++) {
            var visitedRoom = rooms[i];
            visitedRoom = _.extend(visitedRoom,
                Rooms.findOne(visitedRoom.room_id));
        }
        return rooms;
    },

    createdRooms: function() {
        return Rooms.find({ creatorId: Meteor.userId() });
    },

    recommendedRooms: function() {
        //TODO: generate a list of room suggestions
    }
});