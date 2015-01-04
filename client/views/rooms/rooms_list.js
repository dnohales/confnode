Template.roomsList.helpers({
    rooms: function() {
        var user = Meteor.user();
        var userEmail;
        if (user) {
            userEmail = user.emails[0].address;
        } else {
            userEmail = "";
        };
        var query = new RegExp(Session.get('search-query'), 'i');

        return Rooms.find({
            $and: [{
                $or: [{
                    name: query
                }, {
                    description: query
                }, {
                    tags: {
                        $in: [query]
                    }
                }],
            }, {
                $or: [{
                    listed: true
                }, {
                    creatorEmail: {
                        $in: [userEmail]
                    }
                }, {
                    guests: {
                        $in: [userEmail]
                    }
                }]
            }]
        }, {
            sort: {
                submitted: -1
            }
        });
    }
});

Template.roomsList.events({
    'keyup #search_form [name="query"]': function(e) {
        var query = $(e.target).val();
        Session.set('search-query', $.trim(query));
    }
});