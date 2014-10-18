Template.roomSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

/**
       var tag = $("#roomtags").tagging();
        if (!tag) {
            console.log("fail")    ;
        } else {
          var tags = $("#tag").tagging("getTags");
                      console.log("OK")  ;  

        }
  */ 
      // We call taggingJS init on all "#tag" divs
      //t = $( "#roomtags" ).tagging();

      // This is the $tag_box object of the first captured div
      //$tag_box = t[0];

      // To get all tags inside tag box as an array of String
      //$tag_box.tagging( "getTags" );

    var room = {
      name: $(e.target).find('[id=name]').val(),
      description: $(e.target).find('[id=desc]').val(),
      tags: $(e.target).find('[id=desc]').val(),
      guests: $(e.target).find('[id=desc]').val(),
      privacy: $(e.target).find('[name=my-checkbox0]').val(),
      scheduled: $(e.target).find('[name=my-checkbox]').val(),
      datetime: $(e.target).find('[id=datetimepicker1]').val()
    }
    
    Meteor.call('room', room, function(error, id) {
      if (error)
        return alert(error.reason);

      Router.go('roomPage', {_id: id});
    });
  }
});

Template.roomSubmit.rendered = function () {
  var my_custom_options = {
    "no-duplicate": true,
    "no-duplicate-callback": window.alert,
    "no-duplicate-text": "Duplicate tags",
    "type-zone-class": "type-zone",
    "tag-box-class": "tagging",
    "forbidden-chars": [",", "?"]
  };
  var t = $("#roomtags").tagging(my_custom_options);
  t[0].addClass("form-control");
  console.log( t[0] );

  var t1 = $("#invites").tagging(my_custom_options);
  t1[0].addClass("form-control");

  //$('.make-switch').bootstrapSwitch();
  $('#datetimepicker1').datetimepicker();
  $("[name='my-checkbox']").bootstrapSwitch('size','mini','mini');
  $("[name='my-checkbox0']").bootstrapSwitch('size','mini','mini');

}