Template.roomItem.helpers({
    ownRoom: function() {
        return this.userId == Meteor.userId();
    },

    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    }
});

Template.roomsList.events({
    'click .delete-room-button': function(e) {
        e.preventDefault();
        if (confirm("Are you sure you want to delete this room?\nRoom name: " + this.name)) {
            Rooms.remove(this._id);
        }
    }
});
