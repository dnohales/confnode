var FixtureManager = {
    generateTags: function() {
        var tagsSets = [
            ['meteor', 'nodejs', 'mongodb', 'npm'],
            ['symfony', 'php', 'doctrine', 'twig'],
            ['gaming', 'unity', 'game-engines'],
            ['economy']
        ];

        var set = Fake.fromArray(tagsSets);
        var tags = [];
        var matchDegrader = 0;

        for (var i in set) {
            var matchArray = [true];
            for (var j = 0; j < matchDegrader; j++) {
                matchArray.push(false);
            }
            if (Fake.fromArray(matchArray)) {
                tags.push(set[i]);
            }
            matchDegrader++;
        }

        return tags;
    },

    run: function() {
        var users = {};

        users.admin = Accounts.createUser({
            username: 'admin',
            email: 'admin@confnode.com',
            password: '1234',
            profile: {
                fullname: 'Damián Nohales',
                company: 'conf.node inc.',
                location: 'Argentina',
                availability: {
                    morning: true,
                    afternoon: true,
                    night: true,
                }
            }
        });

        for (var i = 0; i < 200; i++) {
            var fakeUser = Fake.user();
            fakeUser.username = fakeUser.fullname.toLowerCase().replace(' ', '');

            Accounts.createUser({
                username: fakeUser.username,
                email: fakeUser.email,
                password: '1234',
                profile: {
                    fullname: fakeUser.fullname,
                    company: Fake.word(),
                    location: Fake.word(),
                    availability: {
                        morning: true,
                        afternoon: true,
                        night: true,
                    }
                }
            });
        }

        _.each(Meteor.users.find().fetch(), function(user) {
            roomsCount = Fake.fromArray([
                0,
                0,
                0,
                0,
                _.random(1, 5),
                0,
                0,
                0,
                0,
                _.random(6, 10),
                0,
                0,
                0,
                0
            ]);

            for (var j = 0; j < roomsCount; j++) {
                var date = new Date();
                date.setDate(date.getDate() - _.random(-180, -1));

                roomId = Rooms.insert({
                    creatorId: user._id,
                    creatorEmail: user.emails[0].address,
                    creatorName: user.username,
                    submittedTime: date,

                    name: Fake.sentence(3).replace('.', ''),
                    description: Fake.sentence(20),
                    tags: FixtureManager.generateTags(),
                    guests: [],
                    listed: true,
                    public: true,
                    scheduled: false,
                    scheduledTime: null,
                    chat: true
                });

                var users = Meteor.users.find().fetch();
                for (var k in users) {
                    var u = users[k];
                    if (u._id !== user._id) {
                        if (_.random(0, 1) === 1) {
                            Meteor.users.helpers.addVisitedRoom(u._id, roomId);
                            if (Fake.fromArray([0, 0, 1]) === 1) {
                                Rooms.helpers.addFeeling({
                                    roomId: roomId,
                                    feeling: {
                                        rating: Fake.fromArray([0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5]),
                                        comment: Fake.sentence(15)
                                    }
                                }, u._id);
                            }
                        }
                    }
                }
            }
        });
    }
};

Meteor.startup(function() {
    if (Meteor.users.find().count() === 0) {
        console.log('Loading fixtures...');
        FixtureManager.run();
        console.log('Done loading fixtures...');
    }
});
