Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      message: $(e.target).find('[name=message]').val()
    }
    
    Meteor.call('post', post, function(error, id) {
      if (error)
        return alert(error.reason);

      Router.go('postPage', {_id: id});
    });
  }
});

Template.postSubmit.rendered = function () {
  var my_custom_options = {
    "no-duplicate": true,
    "no-duplicate-callback": window.alert,
    "no-duplicate-text": "Duplicate tags",
    "type-zone-class": "type-zone",
    "tag-box-class": "tagging",
    "forbidden-chars": [",", ".", "_", "?"]
  };
  var t = $("#roomtags").tagging(my_custom_options);
  t[0].addClass("form-control");
  
  var t1 = $("#invites").tagging(my_custom_options);
  t1[0].addClass("form-control");

  $('.make-switch').bootstrapSwitch();
  $('.datetimepicker').datetimepicker();

}