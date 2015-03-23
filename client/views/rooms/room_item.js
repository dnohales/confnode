Template.roomItem.helpers({
    ownRoom: function() {
        return this.creatorId == Meteor.userId();
    },
    calendarURL: function() {
        //dear god, where is the Room's URL?
        var roomUrl = window.location.href.slice(0, -1) + Rooms._prefix + this._id;
        return "http://www.google.com/calendar/event?action=TEMPLATE&text=" + encodeURIComponent("Conf.Node: " + this.name) + "&details=" + encodeURIComponent(this.description + "\n\nJoin at: " + roomUrl) + "&dates=" + dateToGoogleISO(this.scheduledTime) + '/' + dateToGoogleISO(this.scheduledTime);
    },
    roomGuestsAccess: function() {
        var userEmail;
        var user = Meteor.user();
        if (user === null) {
            return false;
        } else {
            userEmail = user ? user.emails[0].address : "";
            if (!this.public) {
                return !!(this.guests.indexOf(userEmail) !== -1 || this.creatorName === user.username);
            } else {
                return true;
            }
        }
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

/**
 * Takes a date and turns it to what google calendar needs
 * @param {Date} date
 * @returns {String} The date ISO 8601 formatted
 */
var dateToGoogleISO = function(date) {
    var str = date.toISOString();
    str = str.replace(/-|:|\./g, '');
    return str.substr(0, 15) + 'Z';
};