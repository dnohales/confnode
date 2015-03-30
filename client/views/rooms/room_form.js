Template.roomForm.events({
    'click #delete': function(e) {
        e.preventDefault();

        if (confirm("Are you sure you want to delete this room?\nRoom name: " + this.name)) {
            var currentRoomId = this._id;
            Rooms.remove(currentRoomId);
            Router.go('roomsList');
        }
    },

    'submit form': function(e) {
        var room;
        var method;
        e.preventDefault();

        room = getRoom();

        if (isInsert(this)) {
            method = 'roomInsert';
            //TODO suggest guests based on tags
            Meteor.call('searchGuests', room.tags);
        } else {
            method = 'roomUpdate';
            _.extend(room, {
                _id: this._id
            });
        }

        Meteor.call(method, room, function(error, result) {
            if (error) {
                return alert(error.message);
            }

            if (room.guests.length > 0) {
                Meteor.call('sendEmail',
                    room.guests,
                    'conf.node@gmail.com',
                    'Invite ' + room.name + ' by ' + Meteor.user().username,
                    'This is a test of Email.send.');
            }

            Router.go('roomPage', {
                _id: result._id
            });
        });
    },

    'switchChange.bootstrapSwitch #form_room [name="scheduled"]': function() {
        refreshScheduledTimeControls();
    },

});

var getRoom = function() {
    var $form = $('#form_room');

    return {
        name: $form.find('[name="name"]').val(),
        description: $form.find('[name="description"]').val(),
        tags: $form.find('[name="tags"]').tagit("assignedTags"),
        guests: $form.find('[name="guests"]').tagit("assignedTags"),
        listed: $form.find('[name="listed"]').prop('checked'),
        public: $form.find('[name="public"]').prop('checked'),
        scheduled: $form.find('[name="scheduled"]').prop('checked'),
        scheduledTime: new Date($form.find('[name="scheduledTime"]')
            .data("DateTimePicker").getDate()),
        chat: $form.find('[name="chat"]').prop('checked')
    };
};

var refreshScheduledTimeControls = function() {
    var $form = $('#form_room');
    $form.find('.scheduled-time-controls').toggle($form.find('[name="scheduled"]').prop('checked'));
};

Template.roomForm.helpers({
    isInsert: function() {
        return isInsert(this);
    },
    submitButtonName: function() {
        return isInsert(this) ? 'Create' : 'Update';
    }
});

var isInsert = function(context) {
    return typeof context._id === "undefined";
};

Template.roomForm.rendered = function() {
    var $form = $('#form_room');
    var data = this.data;

    var tagitOptions = {
        removeConfirmation: true,
        caseSensitive: false,
        preprocessTag: function(val) {
            if (!val) return '';
            return val.toLowerCase();
        }
    };

    var updateAutocompleteTags = function(event, ui) {
        var tagsWidget = $('#form_room [name="tags"]');
        var tags = tagsWidget.tagit("assignedTags");
        Meteor.call('getRelatedTags', tags, 5, function(error, result) {
            if (error) {
                console.log(error)
            }
            else {
                Session.set('recommendedTags', result);
                if (!ui.duringInitialization) {
                    tagsWidget.data("ui-tagit").tagInput.focus();
                }
            }
        });
    };

    $form.find('[name="tags"]').tagit(_.extend(tagitOptions, {
        afterTagAdded: updateAutocompleteTags,
        afterTagRemoved: updateAutocompleteTags,
        showAutocompleteOnFocus: true,
        autocomplete: {
            delay: 0,
            source: function(request, response) {
                response(Session.get('recommendedTags'));
            }
        }
    }));

    $form.find('[name="guests"]').tagit(_.extend(tagitOptions, {
        beforeTagAdded: function(event, ui) {
            if (!ui.duringInitialization) {
                return isValidEmail(ui.tagLabel);
            }
        }
    }));

    var checkboxScheduled = $form.find('[name="scheduled"]');
    var checkboxPublic = $form.find('[name="public"]');
    var checkboxChat = $form.find('[name="chat"]');
    var checkboxListed = $form.find('[name="listed"]');
    var dateNow = new Date();
    var datePicker = $form.find('[name="scheduledTime"]').datetimepicker({
        minDate: dateNow
    }).data("DateTimePicker");

    if (data === null) {
        // If this is '/submit'
        checkboxScheduled.prop('checked', true);
        datePicker.setDate(dateNow);
        checkboxPublic.prop('checked', true);
        checkboxListed.prop('checked', true);
        checkboxChat.prop('checked', true);
    } else {
        // If this is '/edit'
        checkboxScheduled.prop('checked', data.scheduled);
        if (data.scheduledTime) {
            datePicker.setDate(data.scheduledTime);
        }
        checkboxPublic.prop('checked', data.public);
        checkboxListed.prop('checked', data.listed);
        checkboxChat.prop('checked', data.chat);
    }

    refreshScheduledTimeControls();

    $('.bootstrap-switch').bootstrapSwitch('size', 'mini', 'mini');
};
