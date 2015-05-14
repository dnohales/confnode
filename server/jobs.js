var tagRelationsJob = function() {
    var tags = [];

    // Get all tags fields with more than one tag.
    var tagsFields = Rooms.find({
        'tags.1': {
            $exists: true
        }
    }, {
        fields: {
            _id: 0,
            tags: 1
        }
    }).fetch();

    // Extract from the tags fields found, only the tags without duplicating.
    tagsFields.forEach(function(tagsField) {
        tagsField['tags'].forEach(function(tag) {
            if (tags.indexOf(tag) === -1) {
                tags.push(tag);
            }
        });
    });

    // For each tag, get its tag relations and save them in the collection.
    tags.forEach(function(tag) {
        var tagRelations = [];

        // Get the tags fields that are related to the current tag.
        var relatedTagsFields = tagsFields.filter(function(tagsField) {
            return tagsField['tags'].indexOf(tag) !== -1;
        });

        relatedTagsFields.forEach(function(relatedTagsField) {
            relatedTagsField['tags'].forEach(function(relatedTag) {
                if (relatedTag === tag) {
                    return;
                }

                var relation = tagRelations.filter(function(tagRelation) {
                    return tagRelation.tag === relatedTag;
                })[0];

                // If it is the first occurrence of this tag, save it.
                if (typeof relation === "undefined") {
                    tagRelations.push({
                        'tag': relatedTag,
                        'weight': 1
                    });
                } else {
                    relation.weight++;
                }
            });
        });

        // Save to the collection.
        TagRelations.upsert({
            tag: tag
        }, {
            $set: {
                relations: tagRelations
            }
        });
    });
};

var producePioBuyEvent = function(userId, tag, date) {
    return {
        event: 'buy',
        entityType: 'user',
        entityId: userId,
        targetEntityType: 'item',
        targetEntityId: tag,
        eventTime: date
    };
};

var producePioRateEvent = function(userId, tag, date, score) {
    return {
        event: "rate",
        entityType: "user",
        entityId: userId,
        targetEntityType: "item",
        targetEntityId: tag,
        properties: {
            rating: score
        },
        eventTime: date
    };
};

var pioDataCollect = function() {
    var fs = Npm.require('fs');
    var path = Npm.require('path');
    var eventsFilePath = path.resolve('.').split('.meteor')[0] + 'pio_events';
    var events = [];

    var roomFeelings = Rooms.find({
        'feelings.0': {
            $exists: true
        },
        'tags.0': {
            $exists: true
        }
    }, {
        fields: {
            _id: 0,
            feelings: 1,
            tags: 1
        }
    }).fetch();

    roomFeelings.forEach(function(room) {
        room['feelings'].forEach(function(feeling) {
            room['tags'].forEach(function(tag) {
                var rate = producePioRateEvent(feeling.user_id, tag, feeling.dateRate, feeling.rating);
                events.push(JSON.stringify(rate));
            });
        });
    });

    var userVisits = Meteor.users.find({
        'visitedRooms.0': {
            $exists: true
        }
    }, {
        fields: {
            visitedRooms: 1
        }
    }).fetch();

    userVisits.forEach(function(visit) {
        visit.visitedRooms.forEach(function(visitedRoom) {
            var roomTags = Rooms.findOne({
                _id: visitedRoom.room_id
            }, {
                fields: {
                    _id: 0,
                    tags: 1
                }
            });

            roomTags.tags.forEach(function(tag) {
                var buy = producePioBuyEvent(visit._id, tag, visitedRoom.when);
                events.push(JSON.stringify(buy));
            });
        });
    });

    if (events.length > 0) {
        // Save events to file.
        fs.writeFileSync(eventsFilePath, events[0]);
        for (var i = 1; i < events.length; i++) {
            fs.appendFileSync(eventsFilePath, '\n' + events[i]);
        }
    }
};

Meteor.methods({
    sendPioEvent: function(userId, tag, date, score) {
        var event = typeof score === 'undefined'
                ? producePioBuyEvent(userId, tag, date)
                : producePioRateEvent(userId, tag, date, score);

        HTTP.call('POST',
                'http://localhost:7070/events.json', {
                    params: {
                        accessKey: 'KsPMAPVNBNYqFKBNJlOf5xFsmMVWzifJwFiPlP1r8VODpJmLi6ms0aDMQQMJFHqx'
                    },
                    data: event
                },
        function(error) {
            if (error) {
                console.log('Error sending HTTP request to register PIO event.');
                console.log(error);
            }
        });
    },
    getPioTagRecommendations: function(userId, quantity) {
        try {
            var response = HTTP.call('POST',
                    'http://localhost:8000/queries.json', {
                        data: {
                            user: userId,
                            num: quantity
                        }
                    });

            var tags = new Array();
            response.data.itemScores.forEach(function(tag) {
                tags.push(tag.item);
            });
            console.log('tags');
            console.log(tags);
            return tags.length > 0 ? tags : null;
        }
        catch (exception) {
            console.log('Error sending HTTP request to get PIO tag recommendations.');
            return null;
        }
    }
});

Meteor.startup(function() {
    SyncedCron.config({
        // Name of collection to use for synchronisation and logging.
        collectionName: 'jobsHistory'
    });

    SyncedCron.add({
        name: 'Calculate and store tag relations',
        schedule: function(parser) {
            return parser.text('at 5:00 am');
        },
        job: tagRelationsJob
    });

    // Start processing jobs.
    SyncedCron.start();

    if (TagRelations.find().count() === 0) {
        console.log('Calculating and storing tag relations...');
        tagRelationsJob();
        console.log('Done calculating and storing tag relations.');
        console.log('Producing initial PIO events...');
        pioDataCollect();
        console.log('Done producing initial PIO events.');
    }
});