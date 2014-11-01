Template.roomPage.rendered = function() {
    $("[name='my-checkbox0']").bootstrapSwitch('size', 'mini', 'mini');
};

Template.roomPage.helpers({
    ownRoom: function() {
        return this.userId == Meteor.userId();
    }
});

Template.roomPage.events({
    'switchChange.bootstrapSwitch #chat-checkbox': function() {
        this.chat=!this.chat;
        Rooms.update(this._id, {$set: {chat: this.chat}}, function(error) {
            if (error) {
                alert(error.reason);
            }
        });
    }
});
