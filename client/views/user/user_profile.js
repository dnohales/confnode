Template.userProfile.rendered = function() {
    var tagitOptions = {
        'removeConfirmation': true,
        'caseSensitive': false
    };
    $('#profile_extra [name="skills"]').tagit(tagitOptions);
    $('#profile_extra [name="interests"]').tagit(tagitOptions);

};