Template.roomPage.rendered = function () {
  $("[name='my-checkbox0']").bootstrapSwitch('size','mini','mini');
  $("[name='my-checkbox0']").bootstrapSwitch('state','true','true');
}

Template.roomPage.helpers({
  ownRoom: function() {
    return this.userId == Meteor.userId();
  },
  chatEnabled: function () {
  	return $('input[name="my-checkbox0"]').is(":checked");
  }

});