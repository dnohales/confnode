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


Meteor.methods({
    collectingDataPIO: function() {
        var fs = Npm.require('fs');
        var path = Npm.require('path');
        var basePath = path.resolve('.').split('.meteor')[0];
        var eventsFileName = 'my_events.json';

        fs.exists(basePath + eventsFileName, function(exists) {
            exists ? fs.unlinkSync(basePath + eventsFileName) : '';
        });

        var tagRatesData = [];
        var roomsFeelings = Rooms.find({
            feelings: {
                $exists: true
            }
        }, {
            feelings: 1,
            tags: 1
        }).fetch();

        roomsFeelings.forEach(function(room) {
            var tags = room['tags'];
            var feelings = room['feelings'];
            tags.forEach(function(tag) {
                feelings.forEach(function(feeling) {
                    var rate = {
                        "event": "rate",
                        "entityType": "user",
                        "entityId": feeling.user_id,
                        "targetEntityType": "tag",
                        "targetEntityId": tag,
                        "properties": {
                            "rating": feeling.rating
                        },
                        "eventTime": feeling.dateRate
                    };
                    rate = JSON.stringify(rate);
                    tagRatesData.push(rate);
                    fs.appendFileSync(basePath + eventsFileName, rate + '\r\n');
                });
            });
        });

    }
});

Meteor.call('collectingDataPIO');

SyncedCron.add({
    name: 'Calculate and store tag relations',
    schedule: function(parser) {
        return parser.text('at 5:00 am');
    },
    job: tagRelationsJob
});

SyncedCron.config({
    // Name of collection to use for synchronisation and logging.
    collectionName: 'jobsHistory'
});

Meteor.startup(function() {
    // Start processing jobs.
    SyncedCron.start();

    if (TagRelations.find().count() === 0) {
        console.log('Calculating and storing tag relations...');
        tagRelationsJob();
        console.log('Done calculating and storing tag relations...');
    }
});