Meteor.users.helpers = {
    addVisitedRoom: function(userId, roomId) {
        var users;
        var rooms = Rooms.find({
            _id: roomId
        }, {
            _id: 1
        });
        if (rooms.count() === 0) {
            throw new Meteor.Error(422, 'Room does not exist');
        }

        users = Meteor.users.find({
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
    },

    searchInterestedGuests: function(topics, limit) {
        for (var i in topics) {
            if (topics.hasOwnProperty(i)) {
                topics[i] = new RegExp('^' + topics[i], 'i');
            }
        }

        /**
         * We find in users collection if some of the topics
         * are present in their interests or skills
         * @type {Array}
         */
        var users = Meteor.users.find({
            $or: [{
                'profile.interests': {
                    $in: topics
                }
            }, {
                'profile.skills': {
                    $in: topics
                }
            }]
        }, {
            '_id': 0,
            'emails': 1,
            'profile.skills': 1,
            'profile.interests': 1,
            'visitedRooms': 1
        }).fetch();


        for (var user in users) {
            if (users.hasOwnProperty(user)) {
                user = users[user];
                var skillsMatches = 0;
                var interestsMatches = 0;
                var skills = user.profile.skills;
                var interests = user.profile.interests;

                user.visitedRooms = user.visitedRooms.length;
                for (var topic in topics) {
                    if (topics.hasOwnProperty(topic)) {
                        topic = topics[topic];
                        /**
                         * We want to know how many matches were in skills, then
                         * we analyze where the query match better for the current user and define
                         * the percentage of similarity
                         */
                        if (typeof  skills !== "undefined") {
                            for (var i = skills.length - 1; i >= 0; i--) {
                                if (skills[i].match(topic)) {
                                    skillsMatches++;
                                    break;
                                }
                            }
                        }
                        /**
                         * Know the matches in interest with the same goal that Skills
                         *
                         */
                        if (typeof  interests !== "undefined") {
                            for (var i = interests.length - 1; i >= 0; i--) {
                                if (interests[i].match(topic)) {
                                    interestsMatches++;
                                    break;
                                }
                            }
                        }

                        if (skillsMatches > interestsMatches) {
                            user.similarity = skillsMatches / topics.length;
                        } else {
                            user.similarity = interestsMatches / topics.length;
                        }

                        /**
                         * Calc a coefficient to sort the results, based on similarity as the most
                         * important information and taking into consideration the number of
                         * visited rooms with the purpose of known if user is a frequent guest/user
                         * @type {number}
                         */
                        user.interestCoefficient = user.visitedRooms / Math.pow(user.similarity, 2);
                    }
                }
            }
        }

        users = _.sortBy(users, 'interestCoefficient').reverse();

        // Check if the limit parameter was specified.
        if (typeof limit === "undefined" || limit > users.length) {
            limit = users.length;
        }

        var usersMails = [];
        // Fill the usersMails array with just the user mails.
        for (var i = 0; i < limit; i++) {
            usersMails.push(users[i].emails[0].address);
        }

        return usersMails;
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
        'profile.availability': Array,
        'profile.timezone': {
            name: String,
            offset: Number
        }
    });
};