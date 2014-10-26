Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
        return Meteor.subscribe('rooms');
    }
});

Router.map(function() {
    this.route('roomsList', {path: '/'});

    this.route('roomPage', {
        path: '/rooms/:_id',
        data: function() {
            return Rooms.findOne(this.params._id);
        }
    });

    this.route('roomEdit', {
        path: '/rooms/:_id/edit',
        data: function() {
            return Rooms.findOne(this.params._id);
        }
    });

    this.route('roomSubmit', {
        path: '/submit'
    });
});


var requireLogin = function(pause) {
    if (!Meteor.user()) {
        if (Meteor.loggingIn())
            this.render(this.loadingTemplate);
        else
            this.render('accessDenied');

        pause();
    }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'roomSubmit'});
