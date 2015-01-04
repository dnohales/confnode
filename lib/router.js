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
});

var requireLogin = function(pause) {
    if (!Meteor.user()) {
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');
    } else {
        this.next();
    }
};

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {
    only: ['roomSubmit', 'roomEdit', 'roomPage']
});