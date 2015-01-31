var webrtc;

Template.roomPage.rendered = function() {
    $("#chat_switch").bootstrapSwitch('size', 'mini', 'mini');
    var roomId = this.data._id;


    webrtc = new SimpleWebRTC({
        // the id/element dom element that will hold "our" video
        localVideoEl: 'localVideo',
        // the id/element dom element that will hold remote videos
        remoteVideosEl: '',
        // immediately ask for camera access
        autoRequestMedia: true,
        debug: false,
        detectSpeakingEvents: true,
        autoAdjustMic: true,
        signalingOptions: {
            "force new connection": true
        }
    });

    // we have to wait until it's ready
    webrtc.on('readyToCall', function() {
        // you can name it anything
        console.log(roomId);
        webrtc.joinRoom(roomId);
    });

    webrtc.on('channelMessage', function(peer, label, data) {
        if (data.type == 'volume') {
            showVolume(document.getElementById('volume_' + peer.id), data.volume);
        }
    })


    webrtc.on('videoAdded', function(video, peer) {
        console.log('video added', peer);
        var remotes = document.getElementById('remotes');
        if (remotes) {
            var d = document.createElement('div');
            //d.className = 'videoContainer';
            video.id = 'container_' + webrtc.getDomId(peer);
            //d.appendChild(video);
            var vol = document.createElement('div');
            vol.id = 'volume_' + peer.id;
            vol.className = 'volume_bar';
            video.onclick = function() {
                video.style.width = video.videoWidth + 'px';
                video.style.height = video.videoHeight + 'px';
            };
            //d.appendChild(vol);
            remotes.appendChild(video);
        }
    });

    webrtc.on('videoRemoved', function(video, peer) {
        console.log('video removed ', peer);
        var remotes = document.getElementById('remotes');
        var el = document.getElementById('container_' + webrtc.getDomId(peer));
        if (remotes && el) {
            remotes.removeChild(el);
        }
    });

    // local volume has changed
    webrtc.on('volumeChange', function(volume, treshold) {
        showVolume(document.getElementById('localVolume'), volume);
    });

    Meteor.call('userAddVisitedRoom', roomId);
};

Template.roomPage.destroyed = function() {
    console.log('cierre de webrtc: ' + webrtc.roomName);
    webrtc.stopLocalVideo();
    webrtc.leaveRoom();
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
    if (!el) return;
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
    'submit #form_invite': function(e) {
        e.preventDefault();
        var email = $('#form_invite').find('[id="guest_email"]').val();
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
        }

        toastr.success('Invitación enviada');
    },
    'hidden.bs.modal #myModal': function() {
        $('myModal').find('form')[0].reset();
    },
    'click #feelings_button': function() {
        $('#feelings_dialog .modal').modal();
    }
});