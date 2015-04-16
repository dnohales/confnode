var expertsByVisits;
Template.roomPage.created = function() {
    expertsByVisits = new ReactiveVar();
}
Template.roomPage.rendered = function() {
    var $form;
    var tagitOptions;
    var roomId;

    tagitOptions = {
        'removeConfirmation': true,
        'caseSensitive': false
    };

    $form = $('#form_lookFor');
    $form.find('[name="topics"]').tagit(tagitOptions);
    $("#chat_switch").bootstrapSwitch('size', 'mini', 'mini');

    roomId = this.data._id;
    Meteor.call('userAddVisitedRoom', roomId);

    API.isAppearinCompatible(function(data) {
        if (!data.isSupported) {
            $('#notSupportedModal').modal();
            mixpanel.track("Did not pass the technical checks");
        }
    });
};

Template.roomPage.helpers({
    ownRoom: function() {
        //catch when owner is logged after page was rendered switcher not works
        return this.creatorId == Meteor.userId();
    },
    experts: function() {
        return expertsByVisits.get();
    }
});

Template.roomPage.events({
    'click [data-toggle="popover"]': function() {
        $('[data-toggle="popover"]').popover({
            trigger: 'hover',
            html: true,
            content: function() {
                return $('[data-toggle="popover"]').html();
            }
        });
    },
    'switchChange.bootstrapSwitch #chat_switch': function() {
        this.chat = !this.chat;
        Rooms.update(this._id, {
            $set: {
                chat: this.chat
            }
        }, function(error) {
            if (error) {
                alert(error.reason);
            }
        });
    },
    'submit #form_lookFor': function(e) {
        var topics;
        var $form;
        e.preventDefault();
        $form = $('#form_lookFor');
        topics = $form.find('[name="topics"]').tagit("assignedTags");
        Meteor.call('searchExpert', topics, function(error, result) {
            if (error) {
                return alert(error.message);
            }
            expertsByVisits.set(result);
        });
    },
    'submit #form_invite': function(e) {
        var email;
        e.preventDefault();
        email = $('#form_invite').find('[id="guest_email"]').val();
        Rooms.update(this._id, {
            $addToSet: {
                guests: email
            }
        }, function(error) {
            if (error) {
                alert(error.reason);
            }
        });

        Meteor.call('sendEmail',
            email,
            'conf.node@gmail.com',
            'Hello from Meteor!',
            'This is a test of Email.send.');

        $('#addGuestModal').modal('toggle');

        $('.modal').on('hidden.bs.modal', function() {
            $(this).find('form')[0].reset();
        });

        toastr.options = {
            "closeButton": false,
            "debug": false,
            "progressBar": false,
            "positionClass": "toast-bottom-right",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        toastr.success('Invite shipped');
    },
    'hidden.bs.modal #addGuestModal': function() {
        $('addGuestModal').find('form')[0].reset();
    },
    'click #feelings_button': function() {
        $('#feelings_dialog').find('.modal').modal();
    }
});