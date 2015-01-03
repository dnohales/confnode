Template.roomSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var $form = $(e.target);

        var room = {
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

        Meteor.call('roomInsert', room, function(error, result) {
            if (error) {
                return alert(error.message);
            }
            Router.go('roomPage', {
                _id: result._id
            });
        });
    },

    'switchChange.bootstrapSwitch #form_submit [name="public"]': function() {
        $('#form_submit [name="accessPassword"]').prop('disabled', $('#form_submit [name="public"]').prop('checked'));
    },

    'switchChange.bootstrapSwitch #form_submit [name="scheduled"]': function() {
        var dateTimePicker = $('#form_submit [name="scheduledTime"]').data("DateTimePicker")
        if ($('#form_submit [name="scheduled"]').prop('checked')) {
            dateTimePicker.enable();
        } else {
            dateTimePicker.disable();
        }
    }
});

Template.roomSubmit.rendered = function() {
    var tagitOptions = {
        'removeConfirmation': true,
        'caseSensitive': false
    };
    $('#form_submit [name="tags"]').tagit(tagitOptions);
    $('#form_submit [name="guests"]').tagit(_.extend(tagitOptions, {
        'beforeTagAdded': function(event, ui) {
            if (!ui.duringInitialization) {
                return isValidEmail(ui.tagLabel);
            }
        }
    }));

    var date = new Date();
    $('#form_submit [name="scheduledTime"]').datetimepicker({
        minDate: date,
        defaultDate: date
    });

    $('.bootstrap-switch').bootstrapSwitch('size', 'small');
};