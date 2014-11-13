Template.roomSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var $form = $(e.target);

        var room = {
            name: $form.find('[name="name"]').val(),
            description: $form.find('[name="description"]').val(),
            privacy: $form.find('[name="public"]').val()? 'public':'private',
            accessPin: $form.find('[name="accessPin"]').val(),
            scheduled: $form.find('[name="scheduled"]').prop('checked'),
            schedulingTime: $form.find('[name="schedulingTime"]').data("DateTimePicker").getDate(),
            chat: $form.find('[name="chat"]').prop('checked')
        }
            tags: $form.find('#tags').tagit("assignedTags"),
            guests: $form.find('#guests').tagit("assignedTags"),

        Meteor.call('roomInsert', room, function(error, result) {
            if (error)
                return alert(error.reason);

            Router.go('roomPage', {_id: result._id});
        });
    }
});

Template.roomSubmit.rendered = function() {
    var tagitOptions = {
        'removeConfirmation': true,
        'caseSensitive': false
    };
    $('#tags').tagit(tagitOptions);
    $('#guests').tagit(tagitOptions);
    
    });

    $('.datetimepicker').datetimepicker();
    $('.bootstrap-switch').bootstrapSwitch();
};
