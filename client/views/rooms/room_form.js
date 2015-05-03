var recommendedGuests;
var recommendedTags;
var scheduleSuggestion;

Template.roomForm.created = function() {
    recommendedGuests = new ReactiveVar();
    recommendedTags = new ReactiveVar();
    scheduleSuggestion = new ReactiveVar(null);
};

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

    'focus #form_room [name="guests"]': function(e) {
        var tags = $('#form_room').find('[name="tags"]').tagit("assignedTags");
        if (tags.length > 1) {
            Meteor.call('searchInterestedGuests', tags, 5, function(error, result) {
                recommendedGuests.set(result);
            });
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

var refreshScheduledTimeControls = function() {
    var $form = $('#form_room');
    $form.find('.scheduled-time-controls').toggle($form.find('[name="scheduled"]').prop('checked'));
};

var onGuestChanged = function() {
    var guests = $('#form_room').find('[name="guests"]').tagit("assignedTags");

    if (guests.length === 0) {
        scheduleSuggestion.set(null);
    } else {
        Meteor.call('roomGetAvailability', guests, function(error, result) {
            if (error) {
                scheduleSuggestion.set(null);
            } else {
                scheduleSuggestion.set(result);
            }
        });
    }
};

Template.roomForm.helpers({
    isInsert: function() {
        return isInsert(this);
    },
    submitButtonName: function() {
        return isInsert(this) ? 'Create' : 'Update';
    },
    scheduleSuggestion: function() {
        return scheduleSuggestion.get();
    },
    suggestedAvailabilityTableHTML: function() {
        var _scheduleSuggestion = scheduleSuggestion.get();
        var html = '<table class="table table-bordered table-hover table-suggested-availability"><tbody>';

        if (_scheduleSuggestion === null || _scheduleSuggestion.availabilityData === null) {
            return '';
        }

        // Hours row
        html += '<tr><td></td>';
        for (var hour = 0; hour < 24; hour++) {
            html += '<td>' + hour.toString() + '</td>';
        }
        html += '</tr>';

        for (var day = 0; day < 7; day++) {
            html += '<tr><td>' + Utils.getShortDayOfWeek(day) + '</td>';

            for (hour = 0; hour < 24; hour++) {
                var score = _scheduleSuggestion.availabilityData[day][hour];
                var colorClasses;

                if (_scheduleSuggestion.users.length === score) {
                    colorClasses = 'text-success bg-success';
                } else if (score > 0) {
                    colorClasses = 'text-warning bg-warning';
                } else {
                    colorClasses = 'text-danger bg-danger';
                }

                html += '<td class="' + colorClasses + '">' + score + '</td>';
            }

            html += '</tr>';
        }

        html += '</tbody></table>';

        return html;
    },
    unregisteredEmailsNote: function() {
        var _scheduleSuggestion = scheduleSuggestion.get();

        if (_scheduleSuggestion !== null && _scheduleSuggestion.unregisteredEmails.length > 0) {
            return "<p><em>Note, the following guests e-mail addresses are not registered in confnode so we couldn't get availability information from those: " +
                   _scheduleSuggestion.unregisteredEmails.join(', ') + '.';
        } else {
            return '';
        }
    }
});

var isInsert = function(context) {
    return typeof context._id === "undefined";
};

Template.roomForm.rendered = function() {
    var $form = $('#form_room');
    var data = this.data;
    var template = this;

    var tagitOptions = {
        removeConfirmation: true,
        caseSensitive: false,
        preprocessTag: function(val) {
            if (!val) return '';
            return val.toLowerCase();
        }
    };

    var updateAutocompleteTags = function(event, ui) {
        var tagsWidget = $('#form_room').find('[name="tags"]');
        var tags = tagsWidget.tagit("assignedTags");
        Meteor.call('getRelatedTags', tags, 5, function(error, result) {
            if (error) {
                console.log(error)
            } else {
                recommendedTags.set(result);
                recommendedGuests.set(null);

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
                response(recommendedTags.get());
            }
        }
    }));

    $form.find('[name="guests"]').tagit(_.extend(tagitOptions, {
        showAutocompleteOnFocus: true,
        autocomplete: {
            delay: 0,
            source: function(request, response) {
                response(recommendedGuests.get());
            }
        },
        beforeTagAdded: function(event, ui) {
            if (!ui.duringInitialization) {
                return isValidEmail(ui.tagLabel);
            }
        },

        'afterTagRemoved': function(event, ui) {
            onGuestChanged(template);
        },

        'afterTagAdded': function(event, ui) {
            onGuestChanged(template);
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