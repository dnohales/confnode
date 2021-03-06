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

Rooms.helpers = {
    addFeeling: function(data, userId) {
        data.feeling.rating = parseInt(data.feeling.rating, 10);
        var room = Rooms.find({
            _id: data.roomId
        }, {
            limit: 1
        });

        if (room.count() === 0) {
            throw new Meteor.Error(422, 'Room does not exist');
        }
        room = room.fetch()[0];
        if (Permissions.ownsDocument(userId, room)) {
            throw new Meteor.Error(422, 'The room owner is not allowed to rate the room');
        }

        var feelingFound = false;
        for (var i in room.feelings) {
            if (room.feelings.hasOwnProperty(i)) {
                var feeling = room.feelings[i];
                if (feeling.user_id === userId) {
                    feelingFound = true;
                    break;
                }
            }
        }

        var dateRate = new Date();
        if (feelingFound) {
            Rooms.update({
                _id: room._id,
                'feelings.user_id': userId
            }, {
                $set: {
                    'feelings.$.rating': data.feeling.rating,
                    'feelings.$.comment': data.feeling.comment,
                    'dateRate': dateRate.getTime()
                }
            });
        } else {
            Rooms.update({
                _id: room._id
            }, {
                $push: {
                    'feelings': {
                        'user_id': userId,
                        'rating': data.feeling.rating,
                        'comment': data.feeling.comment,
                        'dateRate': dateRate.getTime()
                    }
                }
            });
        }

        // Relate user to room tags rating.
        room.tags.forEach(function(tag) {
            Meteor.call('sendPioEvent', userId, tag, dateRate, data.feeling.rating);
        });
    }
};

Meteor.methods({
    roomInsert: function(infoRoom) {
        var user;
        var room;
        validateRoom(infoRoom);

        user = Meteor.user();
        room = _.extend(infoRoom, {
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
        Rooms.helpers.addFeeling(data, Meteor.userId());
    },
    searchExpert: function(topics) {
        var resultsByTrends;
        var pipelineTrendsQuery;
        var resultsByVisits;
        var pipelineVisitsQuery;
        var filters;
        if (this.isSimulation) {
            return [];
        }
        for (var i in topics) {
            if (topics.hasOwnProperty(i)) {
                topics[i] = new RegExp('^' + topics[i], 'i');
            }
        }

        filters = [{
            $unwind: "$feelings"
        }, {
            $match: {
                tags: {
                    $in: topics
                }
            }
        }, {
            $project: {
                '_id': 1,
                'creatorEmail': 1,
                'feelings': 1,
                'tags': 1,
                'visits': 1,
                "old": {
                    $subtract: [new Date(), "$submittedTime"]
                }
            }
        }, {
            $group: {
                _id: {
                    room: "$_id",
                    creator: "$creatorEmail"
                },
                avg_rating: {
                    $avg: "$feelings.rating"
                },
                old: {
                    $min: "$old"
                },
                cant_visits: {
                    $max: "$visits"
                },
                all_tags: {
                    $addToSet: "$tags"
                },
                cant_feelings: {
                    $sum: 1
                }
            }
        }, {
            $group: {
                _id: {
                    creator: "$_id.creator"
                },
                avg_rating: {
                    $avg: "$avg_rating"
                },
                old: {
                    $min: "$old"
                },
                cant_visits: {
                    $sum: "$cant_visits"
                },
                all_tags: {
                    $addToSet: "$all_tags"
                },
                cant_feelings: {
                    $sum: "$cant_feelings"
                }
            }
        }, {
            $project: {
                '_id': 0,
                'avg_rating': {
                    $divide: [{
                            $subtract: [{
                                $multiply: ['$avg_rating', 100]
                            }, {
                                $mod: [{
                                    $multiply: ['$avg_rating', 100]
                                }, 1]
                            }]
                        },
                        100
                    ]
                },
                'old': 1,
                'cant_visits': 1,
                'all_tags': {
                    $cond: [{
                            "$eq": [
                                "$all_tags", [null]
                            ]
                        },
                        [],
                        "$all_tags"
                    ]
                },
                'cant_feelings': 1,
                'user': '$_id.creator'
            }
        }];

        pipelineVisitsQuery = filters.concat([{
            $sort: {
                cant_visits: -1
            }
        }, {
            $limit: 5
        }]);

        resultsByVisits = Rooms.aggregate(pipelineVisitsQuery);
        for (var expertVisit in resultsByVisits) {
            if (resultsByVisits.hasOwnProperty(expertVisit)) {
                var expert = resultsByVisits[expertVisit];
                expert.all_tags = _.uniq(_.flatten(expert.all_tags));
            }
        }
        pipelineTrendsQuery = filters.concat([{
            $sort: {
                old: 1
            }
        }, {
            $limit: 5
        }]);

        resultsByTrends = Rooms.aggregate(pipelineTrendsQuery);

        for (var expertResult in resultsByTrends) {
            var expert = resultsByTrends[expertResult];
            expert.old = msToDays(expert.old);
            var coefficient = expert.cant_visits / Math.pow(expert.old, 1.5);
            expert.trend_coefficient = Math.round(coefficient * 100) / 100;
            expert.all_tags = _.uniq(_.flatten(expert.all_tags));
        }

        resultsByTrends = resultsByTrends.sort(compare).slice(0, 3);

        //Prevent duplicate experts. The same user may be in results by trends or visits
        return _.uniq(_.union(resultsByTrends, resultsByVisits), false, function(u) {
            return u.user;
        }).slice(0, 5);
    },
    roomGetAvailability: function(guests) {
        if (this.isSimulation) {
            return null;
        }

        var users = Meteor.users.aggregate([{
            $unwind: '$emails'
        }, {
            $match: {
                'emails.address': {
                    $in: guests
                }
            }
        }]);

        if (users.length === 0) {
            return {
                message: 'We cannot suggest you a schedule time for your room since none of your guests have account in confnode.',
                availabilityData: null,
                users: [],
                unregisteredEmails: guests
            };
        } else {
            var availabilityData = [];
            var perfectSchedules = [];
            var user, i, day, hour, dayRow;
            var ownerTimezone = moment.tz.zone(Meteor.user().profile.timezone).offset(new Date());


            for (i in users) {
                user = users[i];
                var userTimezone = moment.tz.zone(user.profile.timezone).offset(new Date());
                var offset = Math.ceil(ownerTimezone - userTimezone) / 60;
                var convertedAvailability = new Array(7);

                for (day = 0; day < 7; day++) {
                    convertedAvailability[day] = new Array(24);
                }

                console.log(offset);

                for (day = 0; day < 7; day++) {
                    dayRow = [];
                    for (hour = 0; hour < 24; hour++) {
                        var convertedHour = hour - offset;
                        var convertedDay = day;
                        if (convertedHour > 23) {
                            convertedDay = day === 6 ? 0 : day + 1;
                            convertedHour -= 24;
                        } else if (convertedHour < 0) {
                            convertedDay = day === 0 ? 6 : day - 1;
                            convertedHour += 24;
                        }

                        convertedAvailability[convertedDay][convertedHour] = user.profile.availability[day][hour];
                    }
                }

                user.profile.availability = convertedAvailability;
            }

            for (day = 0; day < 7; day++) {
                dayRow = [];
                for (hour = 0; hour < 24; hour++) {
                    var isPerfectAvailability = true;
                    var hourAvailabilityCount = 0;
                    for (i in users) {
                        user = users[i];
                        if (user.profile.availability[day][hour]) {
                            hourAvailabilityCount++;
                        } else {
                            isPerfectAvailability = false;
                        }
                    }

                    if (isPerfectAvailability) {
                        perfectSchedules.push(Utils.getDayOfWeek(day) + ' at ' + hour + ':00');
                    }

                    dayRow.push(hourAvailabilityCount);
                }
                availabilityData.push(dayRow);
            }

            var message = 'According your guests availability. ';

            if (perfectSchedules.length > 0) {
                message = 'We suggest to schedule your meeting on ';
                if (perfectSchedules.length <= 3) {
                    message += perfectSchedules.slice(0, -1).join(', ') + ' and ' +
                        perfectSchedules[perfectSchedules.length - 1] + '.';
                } else {
                    message += perfectSchedules.slice(0, 3).join(', ') + ' and ' +
                        (perfectSchedules.length - 3) + ' more schedules.';
                }
            } else {
                message = 'We couldn\'t find any suggestion for the schedule.';
            }

            return {
                message: message,
                availabilityData: availabilityData,
                users: _.map(users, function(u) {
                    return {
                        username: u.username,
                        email: u.emails.address,
                        profile: _.pick(u.profile, ['fullname', 'availability'])
                    };
                }),
                unregisteredEmails: _.difference(guests, _.map(users, function(u) {
                    return u.emails.address;
                }))
            };
        }
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

var msToDays = function(mil) {
    return Math.floor((mil / (1000 * 60 * 60 * 24)));
};

var compare = function(a, b) {
    return b.trend_coefficient - a.trend_coefficient;
};

/**
 * Compares two dates
 * @param {Date} d1 first date
 * @param {Date} d2 second date
 * @returns {number} =0 if dates are equal, <0 if first date is earlier than second one
 */
var compareDates = function(d1, d2) {
    if (d1.getYear() != d2.getYear()) {
        return d1.getYear() - d2.getYear();
    }
    if (d1.getMonth() != d2.getMonth()) {
        return d1.getMonth() - d2.getMonth();
    }
    if (d1.getDate() != d2.getDate()) {
        return d1.getDate() - d2.getDate();
    }
    if (d1.getHours() != d2.getHours()) {
        return d1.getHours() - d2.getHours();
    }
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
    var emailFilter = /^([a-zA-Z0-9_\.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailFilter.test(email);
};