Template.roomItem.helpers({
    ownRoom: function() {
        return this.userId == Meteor.userId();
    },

    domain: function() {
        var a = document.createElement('a');
        a.href = this.url;
        return a.hostname;
    },

    calendarURL: function() {
        //dear god, where is the Room's URL?
        var roomUrl = window.location.href.slice(0, -1) + Rooms._prefix + this._id;
        var url = "http://www.google.com/calendar/event?action=TEMPLATE&text="
                + escape("Conf.Node: " + this.name)
                + "&details=" + escape(this.description + "\n\nJoin at: " + roomUrl)
                + "&dates=" + dateToGoogleISO(this.scheduledTime)
                + '/' + dateToGoogleISO(this.scheduledTime);
        return url;
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
function dateToGoogleISO(date) {
    var str = date.toISOString();
    str = str.replace(/-|:|\./g, '');
    return str.substr(0,15) + 'Z';
}
