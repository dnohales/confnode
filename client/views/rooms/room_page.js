Template.roomPage.rendered = function () {
  $("[name='my-checkbox0']").bootstrapSwitch('size','mini','mini');
}

Template.roomPage.helpers({
  ownRoom: function() {
    return this.userId == Meteor.userId();
  }
});