/*
 name
 description
 tags
 guests (mail invites)
 privacy (public or private)
 when (now or scheduled) and (datetime scheduled or without date restriction: now, in ten minutes,... )
 creator
 submitted date

 plugins enabled?

 */

Rooms = new Meteor.Collection('rooms');

Rooms.allow({
    update: Permissions.ownsDocument,
    remove: Permissions.ownsDocument
});

Rooms.deny({
    update: function(userId, room, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'guests', 'description', 'privacy', 'date', 'name', 'tags', 'scheduled', 'datetime', 'chat').length > 0);
    }
});

Meteor.methods({
    roomInsert: function(room) {
        check(Meteor.userId(), String);
        console.log(room.schedulingTime);
        check(room, {
            name: String,
            description: String,
            tags: Array,
            guests: Array,
            privacy: Match.OneOf('public', 'private'),
            accessPin: String,
            scheduled: Boolean,
            // See how the fuck match a Date here, tried but Meteor has decided to kill a kitten instead
            schedulingTime: Match.Any,
            chat: Boolean
        });

        if (!room.scheduled)
            room.schedulingTime = null;

        if (!room.name)
            throw new Meteor.Error(422, 'Please fill the room name');

        var user = Meteor.user();
        var room = _.extend(room, {
            userId: user._id,
            creator: user.username,
            submitted: new Date()
        });

        var roomId = Rooms.insert(room);

        return {
            _id: roomId
        };
    }
});
