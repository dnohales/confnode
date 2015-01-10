/**
 * Created by lisandro on 09/01/15.
 */
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
            'profile.availability': {
                morning: $form.find('[name="morning"]').prop('checked'),
                afternoon: $form.find('[name="afternoon"]').prop('checked'),
                night: $form.find('[name="night"]').prop('checked')
            },
            'profile.timezone': $form.find('[name="pickedTimezone"]').val()
        };

        Meteor.call('userUpdate', user);
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

    if (!data.profile.timezone) {
        timezoneSelect.val(TimezonePicker.detectedZone());
    } else {
        timezoneSelect.val(data.profile.timezone);
    }

    if (data.profile.availability.morning) {
        $form.find('[for="morning"]').addClass('active');
    }
    if (data.profile.availability.afternoon) {
        $form.find('[for="afternoon"]').addClass('active');
    }
    if (data.profile.availability.night) {
        $form.find('[for="night"]').addClass('active');
    }
};