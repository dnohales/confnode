Rooms = new Meteor.Collection('rooms');

Rooms.allow({
    update: Permissions.ownsDocument,
    remove: Permissions.ownsDocument
});

Rooms.deny({
    update: function(userId, room, fieldNames) {
        // may only edit the following fields:
        return (_.without(fieldNames, 'name', 'description', 'tags', 'guests', 'listed', 'public', 'scheduled', 'scheduledTime', 'chat').length > 0);
    }
});

Meteor.methods({
    roomInsert: function(room) {
        validateRoom(room);

        var user = Meteor.user();
        var room = _.extend(room, {
            creatorId: user._id,
            creatorEmail: user.emails[0].address,
            creatorName: user.username,
            submittedTime: new Date()
        });

        var roomId = Rooms.insert(room);

        return {
            _id: roomId
        };
    },
    roomUpdate: function(room) {

        var roomId = room._id;
        delete room._id;

        validateRoom(room);

        Rooms.update({
            _id: roomId
        }, {
            $set: room
        });

        return {
            _id: roomId
        };
    },
    roomAddFeeling: function(data) {
        data.feeling.rating = parseInt(data.feeling.rating, 10);
        var room = Rooms.findOne({
            _id: data.roomId
        });

        if (!room) {
            throw new Meteor.Error(422, 'Room does not exists');
        }

        if (Permissions.ownsDocument(Meteor.userId(), room)) {
            throw new Meteor.Error(422, 'The room owner is not allowed to rate the room');
        }

        var feelingFound = false;

        for (var i in room.feelings) {
            var feeling = room.feelings[i];
            if (feeling.user_id == Meteor.userId()) {
                feelingFound = true;
                break;
            }
        }

        if (feelingFound) {
            Rooms.update({
                _id: room._id,
                'feelings.user_id': Meteor.userId()
            }, {
                $set: {
                    'feelings.$.rating': data.feeling.rating,
                    'feelings.$.comment': data.feeling.comment
                }
            });
        } else {
            Rooms.update({
                _id: room._id
            }, {
                $push: {
                    'feelings': {
                        'user_id': Meteor.userId(),
                        'rating': data.feeling.rating,
                        'comment': data.feeling.comment
                    }
                }
            });
        }
    },
    searchExpert: function(topics) {
        // IA feature : Intelligent recomendation of an expert in a set of topics
        //OK..magic fingers

        for (var i in topics) {
            topics[i] = new RegExp('^' + topics[i] + '$', 'i');
        }


        var pipeline = [{
            $unwind: "$feelings"
        }, {
            $match: {
                tags: {
                    $in: topics
                }
            }
        }, {
            $project: {
                'creatorEmail': 1,
                'feelings': 1,
                'tags': 1,
                'visits': 1
            }
        }, {
            $group: {
                _id: {
                    presenter: "$creatorEmail"
                },
                avg_rating: {
                    $avg: "$feelings.rating"
                },
                cant_visits: {
                    $sum: "$visits"
                },
                all_tags: {
                    $addToSet: "$tags"
                }
            }
        }, {
            $sort: {
                cant_visits: -1,
                avg: -1
            }
        }, {
            $limit: 10
        }];
        var result = Rooms.aggregate(pipeline);

        //  math formula using visits, avg ranking, tags coincidence
        console.log(result);
        //return expert usermail, avg ranking & number of visits in rooms
    }
});

var validateRoom = function(room) {
    check(room, {
        name: String,
        description: String,
        tags: Array,
        guests: Array,
        listed: Boolean,
        public: Boolean,
        scheduled: Boolean,
        scheduledTime: Date,
        chat: Boolean
    });

    //Room Name cannot be empty
    if (!room.name) {
        throw new Meteor.Error(422, 'Please, fill in the room name');
    }

    //If Room is not Public then it has to have an Access Password
    if (!room.public && room.guests.length === 0) {
        throw new Meteor.Error(422, 'Please, provide guests for private room');
    }

    //If Room is not Scheduled then no need for a Time
    if (!room.scheduled) {
        room.scheduledTime = null;
    }
    //If the Room IS Scheduled for a Time, then it cannot be older than right now
    else if (compareDates(room.scheduledTime, new Date()) < 0) {
        throw new Meteor.Error(422, 'The scheduled date must be in the future!!!! Are you a time traveller?');
    }

    //Filter to only keep the valid emails from the guest list
    room.guests = filterEmails(room.guests);
};


/**
 * Compares two dates
 * @param {Date} d1 first date
 * @param {Date} d2 second date
 * @returns {integer} =0 if dates are equal, <0 if first date is earlier than second one
 */
var compareDates = function(d1, d2) {
    if (d1.getYear() != d2.getYear())
        return d1.getYear() - d2.getYear();
    if (d1.getMonth() != d2.getMonth())
        return d1.getMonth() - d2.getMonth();
    if (d1.getDate() != d2.getDate())
        return d1.getDate() - d2.getDate();
    if (d1.getHours() != d2.getHours())
        return d1.getHours() - d2.getHours();
    return d1.getMinutes() - d2.getMinutes()
};

/**
 * Removes invalid emails from an array of them
 * @param {String[]} emails
 * @returns {String[]} only valid emails
 */
var filterEmails = function(emails) {
    var validEmails = [];
    for (var i = 0; i < emails.length; i++) {
        if (isValidEmail(emails[i])) {
            validEmails.push(emails[i]);
        }
    }
    return validEmails;
};

/**
 * Checks if an email is valid
 * @param {String} email
 * @returns {Boolean} true if email format is valid, false otherwise
 */
isValidEmail = function(email) {
    var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailFilter.test(email);
};