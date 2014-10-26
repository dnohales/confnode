Template.roomEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentRoomId = this._id;

        var roomProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        }

        Rooms.update(currentRoomId, {$set: roomProperties}, function(error) {
            if (error) {
                // display the error to the user
                alert(error.reason);
            } else {
                Router.go('roomPage', {_id: currentRoomId});
            }
        });
    },
    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this room?")) {
            var currentRoomId = this._id;
            Rooms.remove(currentRoomId);
            Router.go('rommsList');
        }
    }
});

Template.roomEdit.rendered = function() {
    var my_custom_options = {
        "no-duplicate": true,
        "no-duplicate-callback": window.alert,
        "no-duplicate-text": "Duplicate tags",
        "type-zone-class": "type-zone",
        "tag-box-class": "tagging",
        "forbidden-chars": [",", "?"]
    };
    var t = $("#roomtags").tagging(my_custom_options);
    t[0].addClass("form-control");

    var t1 = $("#invites").tagging(my_custom_options);
    t1[0].addClass("form-control");

    $('#datetimepicker1').datetimepicker();

}