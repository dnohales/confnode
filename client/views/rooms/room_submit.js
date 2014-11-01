Template.roomSubmit.events({
    'submit form': function(e) {
        e.preventDefault();

        var $form = $(e.target);

        var room = {
            name: $form.find('[name="name"]').val(),
            description: $form.find('[name="description"]').val(),
            tags: $form.find('[name="tags"]').tagging('getTags'),
            guests: $form.find('[name="guests"]').tagging('getTags'),
            privacy: $form.find('[name="public"]').val()? 'public':'private',
            accessPin: $form.find('[name="accessPin"]').val(),
            scheduled: $form.find('[name="scheduled"]').prop('checked'),
            schedulingTime: $form.find('[name="schedulingTime"]').data("DateTimePicker").getDate(),
            chat: $form.find('[name="chat"]').prop('checked')
        }

        Meteor.call('roomInsert', room, function(error, result) {
            if (error)
                return alert(error.reason);

            Router.go('roomPage', {_id: result._id});
        });
    }
});

Template.roomSubmit.rendered = function() {
    $('.tagging-box').tagging({
        'no-duplicate': true,
        'type-zone-class': 'type-zone',
        'tag-box-class': 'tagging',
        'forbidden-chars': [',', '?']
    });

    $('.datetimepicker').datetimepicker();
    $('.bootstrap-switch').bootstrapSwitch();
};
