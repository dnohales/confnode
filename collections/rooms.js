/*
name
description
tags
guests (mail invites)
privacy (public or private)
when (now or scheduled) and (datetime scheduled or without date restriction: now, in ten minutes,... )
creator
submitted date

plugins enabled?

*/

Rooms = new Meteor.Collection('rooms');

Rooms.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Rooms.deny({
  update: function(userId, room, fieldNames) {
    // may only edit the following fields:
    return (_.without(fieldNames, 'guests', 'description','privacy', 'date').length > 0);
  }
});

Meteor.methods({
  room: function(roomAttributes) {
    var user = Meteor.user(),
      roomWithSamename = Rooms.findOne({name: roomAttributes.name});
    
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "Please login to create new rooms");
    
    // ensure the room has a name
    if (!roomAttributes.name)
      throw new Meteor.Error(422, 'Please fill in a headline');
    
    // ensure the room has a atleast one tag
    if (!roomAttributes.tags)
      throw new Meteor.Error(422, 'Please fill in a headline');

    //if it is private --- guests , else public guests doesn't mind
    //if it is scheduled --- datetime , else no datetime


    // check that there are no previous Rooms with the same name
    if (roomAttributes.url && roomWithSameName) {
      throw new Meteor.Error(302, 
        'This name has already been used', 
        roomWithSameName._id);
    }
    
    // pick out the whitelisted keys
    var room = _.extend(_.pick(roomAttributes, 'name', 'description', 'tags', 'guests', 'privacy', 'scheduled','datetime'), {
      userId: user._id, 
      creator: user.username, 
      submitted: new Date().getTime()
    });
    
    var roomId = Rooms.insert(room);
    
    return roomId;
  }
});