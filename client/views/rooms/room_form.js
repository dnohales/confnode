Template.roomForm.events({
    'submit form': function(e) {
        e.preventDefault();

        var room = getRoom();

        var method;
        if (isInsert(this)) {
            method = 'roomInsert';
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

            if(room.guests.length > 0){
              Meteor.call('sendEmail',
                room.guests,
                'conf.node@gmail.com',
                'Invitacion ' + room.name + " by " + Meteor.user().username,
                'This is a test of Email.send.');
            }

            Router.go('roomPage', {
                _id: result._id
            });
        });
    },

    'switchChange.bootstrapSwitch #form_room [name="public"]': function() {
        $('#form_room [name="accessPassword"]').prop('disabled', $('#form_room [name="public"]').prop('checked'));
    },

    'switchChange.bootstrapSwitch #form_room [name="scheduled"]': function() {
        var dateTimePicker = $('#form_room [name="scheduledTime"]').data("DateTimePicker")
        if ($('#form_room [name="scheduled"]').prop('checked')) {
            dateTimePicker.enable();
        } else {
            dateTimePicker.disable();
        }
    }
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
        'removeConfirmation': true,
        'caseSensitive': false
    };
    $form.find('[name="tags"]').tagit(tagitOptions);
    $form.find('[name="guests"]').tagit(_.extend(tagitOptions, {
        'beforeTagAdded': function(event, ui) {
            if (!ui.duringInitialization) {
                return isValidEmail(ui.tagLabel);
            }
        }
    }));

    var checkboxScheduled = $form.find('[name="scheduled"]');
    var checkboxPublic = $form.find('[name="public"]');
    var checkboxChat = $form.find('[name="chat"]');
    var checkboxListed = $form.find('[name="listed"]');
    var inputAccessPassword = $form.find('[name="accessPassword"]');
    var dateNow = new Date();
    var datePicker = $form.find('[name="scheduledTime"]').datetimepicker({
        minDate: dateNow
    }).data("DateTimePicker");

    if (data == null) { // If this is '/submit'
        checkboxPublic.prop('checked', true);
        checkboxScheduled.prop('checked', true);
        checkboxListed.prop('checked', true);
        checkboxChat.prop('checked', true);
        datePicker.setDate(dateNow);
    } else { // If this is '/edit'
        if (data.scheduled) {
            checkboxScheduled.prop('checked', true);
            datePicker.setDate(data.scheduledTime);
        } else {
            checkboxScheduled.prop('checked', false);
            datePicker.disable();
        }
        if (data.public) {
            checkboxPublic.prop('checked', true);
            inputAccessPassword.prop('disabled', true);
        } else {
            checkboxPublic.prop('checked', false);
        }
        checkboxListed.prop('checked', data.listed);
        checkboxChat.prop('checked', data.chat);

    }

    $('.bootstrap-switch').bootstrapSwitch('size', 'mini', 'mini');
};

Template.roomForm.events({
    'click #delete': function(e) {
        e.preventDefault();

        if (confirm("Are you sure you want to delete this room?\nRoom name: " + this.name)) {
            var currentRoomId = this._id;
            Rooms.remove(currentRoomId);
            Router.go('roomsList');
        }
    }
});