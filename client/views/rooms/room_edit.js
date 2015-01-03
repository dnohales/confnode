Template.roomEdit.events({
    'submit form': function(e) {
        e.preventDefault();

        var currentRoomId = this._id;

        var $form = $(e.target);

        var roomProperties = {
            name: $form.find('[name="name"]').val(),
            description: $form.find('[name="description"]').val(),
            tags: $form.find('[name="tags"]').tagit("assignedTags"),
            guests: $form.find('[name="guests"]').tagit("assignedTags"),
            listed: $form.find('[name="listed"]').prop('checked'),
            public: $form.find('[name="public"]').prop('checked'),
            accessPassword: $form.find('[name="accessPassword"]').val(),
            scheduled: $form.find('[name="scheduled"]').prop('checked'),
            scheduledTime: new Date($form.find('[name="scheduledTime"]')
                .data("DateTimePicker").getDate()),
            chat: $form.find('[name="chat"]').prop('checked')
        };

        Rooms.update({
            _id: currentRoomId
        }, {
            $set: roomProperties
        }, function(error) {
            if (error) {
                // display the error to the user
                alert(error.reason);
            } else {
                Router.go('roomPage', {
                    _id: currentRoomId
                });
            }
        });
    },

    'click #delete': function(e) {
        e.preventDefault();

        if (confirm("Are you sure you want to delete this room?\nRoom name: " + this.name)) {
            var currentRoomId = this._id;
            Rooms.remove(currentRoomId);
            Router.go('roomsList');
        }
    },

    'switchChange.bootstrapSwitch #form_edit [name="public"]': function() {
        $('#form_edit [name="accessPassword"]').prop('disabled', $('#form_edit [name="public"]').prop('checked'));
    },

    'switchChange.bootstrapSwitch #form_edit [name="scheduled"]': function() {
        var dateTimePicker = $('#form_edit [name="scheduledTime"]').data("DateTimePicker")
        if ($('#form_edit [name="scheduled"]').prop('checked')) {
            dateTimePicker.enable();
        } else {
            dateTimePicker.disable();
        }
    }
});

Template.roomEdit.rendered = function() {
    var tagitOptions = {
        'removeConfirmation': true,
        'caseSensitive': false
    };
    $('#form_edit [name="tags"]').tagit(tagitOptions);
    $('#form_edit [name="guests"]').tagit(_.extend(tagitOptions, {
        'beforeTagAdded': function(event, ui) {
            if (!ui.duringInitialization) {
                return isValidEmail(ui.tagLabel);
            }
        }
    }));

    var dtp = $('#form_edit [name="scheduledTime"]').datetimepicker({
        minDate: new Date(),
    });
    if (this.data.scheduled) {
        dtp.data("DateTimePicker").setDate(this.data.scheduledTime);
    } else {
        dtp.data("DateTimePicker").disable();
    }

    $('.bootstrap-switch').bootstrapSwitch('size', 'small');
};