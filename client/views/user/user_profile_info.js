var refreshSelectAllCheckboxes = function() {
    var count;
    var checkbox;

    for (var hour = 0; hour < 24; hour++) {
        count = $('.availability-regular-checkbox[data-hour="' + hour + '"]:checked').length;
        checkbox = $('.availability-selectall-checkbox[data-hour="' + hour + '"]');
        if (count === 7) {
            checkbox.prop('checked', true).prop('indeterminate', false);
        } else if (count === 0) {
            checkbox.prop('checked', false).prop('indeterminate', false);
        } else {
            checkbox.prop('checked', false).prop('indeterminate', true);
        }
    }

    for (var day = 0; day < 7; day++) {
        count = $('.availability-regular-checkbox[data-day="' + day + '"]:checked').length;
        checkbox = $('.availability-selectall-checkbox[data-day="' + day + '"]');
        if (count === 24) {
            checkbox.prop('checked', true).prop('indeterminate', false);
        } else if (count === 0) {
            checkbox.prop('checked', false).prop('indeterminate', false);
        } else {
            checkbox.prop('checked', false).prop('indeterminate', true);
        }
    }

    count = $('.availability-regular-checkbox:checked').length;
    checkbox = $('.availability-checkbox[data-day="-1"][data-hour="-1"]');
    if (count === 24 * 7) {
        checkbox.prop('checked', true).prop('indeterminate', false);
    } else if (count === 0) {
        checkbox.prop('checked', false).prop('indeterminate', false);
    } else {
        checkbox.prop('checked', false).prop('indeterminate', true);
    }
};

var getAvailabilityData = function() {
    var availability = [];

    for (var day = 0; day < 7; day++) {
        var dayRow = [];
        for (hour = 0; hour < 24; hour++) {
            dayRow.push($('.availability-checkbox[data-day="' + day + '"][data-hour="' + hour + '"]').prop('checked'));
        }
        availability.push(dayRow);
    }

    return availability;
};

Template.userProfileInfo.helpers({
    availabilityData: function() {
        var daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        var data = [];

        // Hours row
        data.push([]);
        data[0].push('');
        data[0].push('');
        for (var hour = 0; hour < 24; hour++) {
            data[0].push(hour.toString());
        }

        for (var day = -1; day < 7; day++) {
            var row = [];

            if (day === -1) {
                row.push('');
            } else {
                row.push(daysOfWeek[day]);
            }

            for (hour = -1; hour < 24; hour++) {
                var extraClass = (hour === -1 || day === -1)? 'availability-selectall-checkbox':'availability-regular-checkbox';
                row.push('<input type="checkbox" class="availability-checkbox ' + extraClass + '" data-hour="' + hour + '" data-day="' + day + '" name="availability_' + hour + '_' + day + '" />');
            }

            data.push(row);
        }

        return data;
    }
});

Template.userProfileInfo.events({
    'submit form': function(e) {
        e.preventDefault();

        var $form = $('#profile_extra');

        var user = {
            'profile.fullname': $form.find('[name="fullname"]').val(),
            'profile.company': $form.find('[name="company"]').val(),
            'profile.location': $form.find('[name="location"]').val(),
            'profile.about': $form.find('[name="about"]').val(),
            'profile.skills': $form.find('[name="skills"]').tagit("assignedTags"),
            'profile.interests': $form.find('[name="interests"]').tagit("assignedTags"),
            'profile.availability': getAvailabilityData(),
            'profile.timezone': {
                name: $form.find('[name="pickedTimezone"]').val(),
                offset: moment.tz.zone($form.find('[name="pickedTimezone"]').val()).offset(new Date() / 60)
            }
        };

        Meteor.call('userUpdate', user, function(error, result) {
            if (error) {
                return alert(error.message);
            }
            Router.go('roomsList');
        });
    },

    'change .availability-checkbox': function(e) {
        var checkbox = $(e.target);

        var hour = parseInt(checkbox.data('hour'));
        var day = parseInt(checkbox.data('day'));

        var selector = '.availability-checkbox';
        selector += hour === -1? '[data-hour!="-1"]':('[data-hour="' + hour + '"]');
        selector += day === -1? '[data-day!="-1"]':('[data-day="' + day + '"]');
        $(selector).prop('checked', checkbox.prop('checked'));

        refreshSelectAllCheckboxes();
    }
});

Template.userProfileInfo.rendered = function() {
    var tagitOptions = {
        'removeConfirmation': true,
        'caseSensitive': false
    };
    var data = this.data;
    var $form = $('#profile_extra');
    var timezoneSelect = $form.find('[name="pickedTimezone"]');

    $form.find('[name="skills"]').tagit(tagitOptions);
    $form.find('[name="interests"]').tagit(tagitOptions);

    if (data.profile.timezone.name) {
        timezoneSelect.val(data.profile.timezone.name);
    } else {
        timezoneSelect.val(TimezonePicker.detectedZone());
    }

    if (data.profile.availability) {
        for (var day in data.profile.availability) {
            for (var hour in data.profile.availability[day]) {
                $form.find('.availability-checkbox[data-day="' + day + '"][data-hour="' + hour + '"]').prop('checked', data.profile.availability[day][hour]);
            }
        }
        refreshSelectAllCheckboxes();
    }
};