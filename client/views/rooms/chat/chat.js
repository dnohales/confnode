chatStream = new Meteor.Stream('chat');
chatCollection = new Meteor.Collection(null);

chatStream.on('chat', function(message, roomId) {
    chatCollection.insert({
        userId: this.userId,
        timeStamp: new Date(),
        roomId: roomId,
        subscriptionId: this.subscriptionId,
        message: message
    });
});

Template.roomChat.helpers({
    "messages": function() {
        return chatCollection.find({
            roomId: this._id
        });
    }
});

Template.chatMsgMe.helpers({
    "user": function() {
        if (this.userId == 'me') {
            return "me";
        } else if (this.userId) {
            var username = Session.get('user-' + this.userId);
            if (username) {
                return username;
            } else {
                getUsername(this.userId);
                return Session.get('user-' + this.userId);
            }
        } else {
            return this.subscriptionId;
        }
    }
});

Template.roomChat.events({
    "submit form": function(e) {
        e.preventDefault();
        var $chat = $('#chat-message');
        var message = $chat.val();
        chatCollection.insert({
            userId: 'me',
            timeStamp: new Date(),
            roomId: this._id,
            message: message
        });
        chatStream.emit('chat', message, this._id);
        $chat.val('');
    }
});

var getUsername = function(id) {
    Meteor.subscribe('user-info', id);
    Tracker.autorun(function() {
        var user = Meteor.users.findOne(id);
        if (user) {
            Session.set('user-' + id, user.username);
        }
    });
};