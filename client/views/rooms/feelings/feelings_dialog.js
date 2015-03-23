var getFeeling = function() {
    var $form = $('#form_feelings_dialog');

    return {
        rating: $form.find('[name="rating"]:checked').val(),
        comment: $form.find('[name="comment"]').val()
    };
};

Template.feelingsDialog.helpers({
    feeling: function() {
        var feeling;
        for (var i in this.feelings) {
            feeling = this.feelings[i];
            if (feeling.user_id == Meteor.userId()) {
                return feeling;
            }
        }

        return null;
    }
});

Template.feelingsDialog.events({
    'submit #form_feelings_dialog': function(e) {
        var buttonsSelector;
        var feelingsDialog;
        e.preventDefault();
        feelingsDialog = $('#feelings_dialog');
        buttonsSelector = feelingsDialog.find('.modal-footer .btn');
        buttonsSelector.prop('disabled', true);

        Meteor.call('roomAddFeeling', {
            roomId: this._id,
            feeling: getFeeling()
        }, function(error, result) {
            buttonsSelector.prop('disabled', false);

            if (error) {
                return alert(error.message);
            }

            feelingsDialog.find('.modal').modal('hide');
        });
    }
});