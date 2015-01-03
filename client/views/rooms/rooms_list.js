Template.roomsList.helpers({
    rooms: function() {
    	var user = Meteor.user();
        return Rooms.find({
            $or: [{
                listed: true
            }, {
                presenter: {
                    $in: [user.emails[0].address]
                }
            }, {
                guests: {
                    $in: [user.emails[0].address]
                }
            }]
        }, {
            sort: {
                submitted: -1
            }
        });
    }
});