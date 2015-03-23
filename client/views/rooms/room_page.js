Template.roomPage.rendered = function() {
    var $form;
    var tagitOptions;
    var roomId;
    delete Session.keys['search-expert-query'];
    delete Session.keys['search-expert-trend-query'];

    $form = $('#form_lookFor');

    tagitOptions = {
        'removeConfirmation': true,
        'caseSensitive': false
    };
    $form.find('[name="topics"]').tagit(tagitOptions);
    $("#chat_switch").bootstrapSwitch('size', 'mini', 'mini');
    roomId = this.data._id;

    API.isAppearinCompatible(function(data) {
        if (!data.isSupported) {
            $('#notSupportedModal').modal();
            mixpanel.track("Did not pass the technical checks");
        }
    });

    Meteor.call('userAddVisitedRoom', roomId);
};

var rotateVideo = function(mediaElement) {
    mediaElement.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
    setTimeout(function() {
        mediaElement.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
    }, 1000);
};

var scaleVideos = function() {
    var videos = document.querySelectorAll('video'),
        length = videos.length,
        video;

    var minus = 100;
    var windowHeight = 300;
    var windowWidth = 300;
    var windowAspectRatio = windowWidth / windowHeight;
    var videoAspectRatio = 4 / 3;
    var blockAspectRatio;
    var tempVideoWidth = 0;
    var maxVideoWidth = 0;

    for (var i = length; i > 0; i--) {
        blockAspectRatio = i * videoAspectRatio / Math.ceil(length / i);
        if (blockAspectRatio <= windowAspectRatio) {
            tempVideoWidth = videoAspectRatio * windowHeight / Math.ceil(length / i);
        } else {
            tempVideoWidth = windowWidth / i;
        }
        if (tempVideoWidth > maxVideoWidth)
            maxVideoWidth = tempVideoWidth;
    }
    for (var i = 0; i < length; i++) {
        video = videos[i];
        if (video)
            video.width = maxVideoWidth - minus;
    }

    console.log(this.userId);

};

var showVolume = function(el, volume) {
    if (!el) {
        return;
    }
    if (volume < -45) { // vary between -45 and -20
        el.style.height = '0px';
    } else if (volume > -20) {
        el.style.height = '100%';
    } else {
        el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
    }
};

Template.roomPage.helpers({
    ownRoom: function() {
        //catch when owner is logged after page was rendered switcher not works
        return this.creatorId == Meteor.userId();
    },
    experts: function() {
        return Session.get('search-expert-query');
    },
    expertsTrends: function() {
        return Session.get('search-expert-trend-query');
    }
});

Template.roomPage.events({
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
            Session.set('search-expert-query', result[0]);
            Session.set('search-expert-trend-query', result[1]);
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

        $('#myModal').modal('toggle');

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
    'hidden.bs.modal #myModal': function() {
        $('myModal').find('form')[0].reset();
    },
    'click #feelings_button': function() {
        $('#feelings_dialog').find('.modal').modal();
    }
});