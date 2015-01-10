Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
        return Meteor.subscribe('rooms');
    }
});

Router.map(function() {
    this.route('roomsList', {
        path: '/'
    });

    this.route('roomPage', {
        path: '/rooms/:_id',
        data: function() {
            return Rooms.findOne(this.params._id);
        }
    });

    this.route('roomSubmit', {
        path: '/submit',
        template: 'roomForm'
    });

    this.route('roomEdit', {
        path: '/rooms/:_id/edit',
        template: 'roomForm',
        data: function() {
            return Rooms.findOne(this.params._id);
        }
    });

    this.route('requestAccess', {
        path: '/room_denied/:_id',
        data: function() {
            return Rooms.findOne(this.params._id);
        }
    });

    this.route('profile', {
        path: '/user',
        template: 'userProfile',
        data: function() {
            return Meteor.users.findOne(Meteor.userId());
        }
    });
});

var requireLogin = function() {
    if (!Meteor.user()) {
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');
    } else {
        this.next();
    }
};

var editPermission = function() {
    var room = Rooms.findOne(this.params._id);
    var user = Meteor.user();
    if (room.creator === user.username) {
        this.next();
    } else {
        this.render('accessDenied');
    };
}

var roomGuestsAccess = function() {
    var room = Rooms.findOne(this.params._id);
    var user = Meteor.user();
    var userEmail = user ? user.emails[0].address : "";

    if(!room.public){
        if (room.guests.indexOf(userEmail) !== -1 || room.creator === user.username) {
            this.next();
        } else {
            this.render('requestAccess');
        };
    } else {
        this.next();
    }

}

Router.onBeforeAction('loading');

Router.onBeforeAction(requireLogin, {
    only: ['roomSubmit', 'roomEdit', 'roomPage']
});

Router.onBeforeAction(editPermission, {
    only: ['roomEdit']
});

Router.onBeforeAction(roomGuestsAccess, {
    only: ['roomPage']
});