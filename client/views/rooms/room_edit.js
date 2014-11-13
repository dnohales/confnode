Template.roomEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentRoomId = this._id;

        var roomProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val(),
            name: $(e.target).find('[id=name]').val(),
            description: $(e.target).find('[id=desc]').val(),
            privacy: $(e.target).find('[name=my-checkbox0]').bootstrapSwitch('state'),
            scheduled: $(e.target).find('[name=my-checkbox]').bootstrapSwitch('state'),
            datetime: $(e.target).find('[id=datetimepicker1]').val(),
            chat: $(e.target).find('[name=my-checkbox1]').bootstrapSwitch('state')
            tags: $form.find('#tags').tagit("assignedTags"),
            guests: $form.find('#guests').tagit("assignedTags"),
        };

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
            Router.go('roomsList');
        }
    }
});

Template.roomEdit.rendered = function() {
    var tagitOptions = {
        'removeConfirmation': true,
        'caseSensitive': false
    };
    $('#datetimepicker1').datetimepicker();
    $("[name='my-checkbox']").bootstrapSwitch('size', 'mini', 'mini');
    $("[name='my-checkbox0']").bootstrapSwitch('size', 'mini', 'mini');
    $("[name='my-checkbox1']").bootstrapSwitch('size', 'mini', 'mini');
    $('#tags').tagit(tagitOptions);
    $('#guests').tagit(tagitOptions);
    
};

Template.roomEdit.helpers({
    getTags: function() {
        var str="";
        for (var i=0; i<this.tags.length; i++) {
            str = str + "<li>" + this.tags[i] + "</li>";
        }
        return str;
    },
    getGuests: function() {
        var str="";
        for (var i=0; i<this.guests.length; i++) {
            str = str + "<li>" + this.guests[i] + "</li>";
        }
        return str;
    }
});
