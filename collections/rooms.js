Rooms = new Meteor.Collection('rooms');

Rooms.allow({
    update: Permissions.ownsDocument,
    remove: Permissions.ownsDocument
});

Rooms.deny({
    update: function(userId, room, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'name', 'description', 'tags', 'guests', 'public', 'accessPassword', 'scheduled', 'scheduledTime', 'chat').length > 0);
    }
});

Meteor.methods({
    roomInsert: function(room) {
        check(Meteor.userId(), String);
        check(room, {
            name: String,
            description: String,
            tags: Array,
            guests: Array,
            public: Boolean,
            accessPassword: String,
            scheduled: Boolean,
            // See how the fuck match a Date here, tried but Meteor has decided to kill a kitten instead
            scheduledTime: Date, //Deal with it. (•_•) / ( •_•)>⌐■-■  / (⌐■_■)
            chat: Boolean
        });

        //Room Name cannot be empty
        if (!room.name) {
            throw new Meteor.Error(422, 'Please, fill in the room name');
        }

        //If Room is not Public then it has to have an Access Password
        if (!room.public && !room.accessPassword) {
            throw new Meteor.Error(422, 'Please, provide an access password for private room');
        }

        //If Room is not Scheduled then no need for a Time
        if (!room.scheduled) {
            room.scheduledTime = null;
        }
        //If the Room IS Scheduled for a Time, then it cannot be older than right now
        else if (compareDates(room.scheduledTime, new Date()) < 0) {
            throw new Meteor.Error(422, 'The scheduled date must be in the future!!!!11 Are you a time traveller?');
        }

        var user = Meteor.user();
        var room = _.extend(room, {
            userId: user._id,
            creator: user.username,
            submittedTime: new Date()
        });

        var roomId = Rooms.insert(room);

        return {
            _id: roomId
        };
    }
});

/**
 * Compares two dates
 * @param {Date} d1 first date
 * @param {Date} d2 second date
 * @returns {integer} =0 if dates are equal, <0 if first date is earlier than second one
 */
function compareDates(d1, d2) {
    if (d1.getYear() != d2.getYear())
        return d1.getYear() - d2.getYear();
    if (d1.getMonth() != d2.getMonth())
        return d1.getMonth() - d2.getMonth();
    if (d1.getDate() != d2.getDate())
        return d1.getDate() - d2.getDate();
    if (d1.getHours() != d2.getHours())
        return d1.getHours() - d2.getHours();
    return d1.getMinutes() - d2.getMinutes()
}
