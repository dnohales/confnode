TagRelations = new Meteor.Collection('tagRelations');

Meteor.methods({
    /**
     * Obtains an array of tags related to the ones provided,
     *  sorted in descending order by the relation's strength.
     * @param {Array|string} referenceTags The tags to search related tags for.
     * @param {Number} limit (Optional) Limits the amount of elements the
     *  returned array contains.
     * @returns {Array|string} The tags related to the ones provided.
     */
    getRelatedTags: function(referenceTags, limit) {
        var relatedTags = [];
        var tags = [];

        // Get all the relations fields about the referenceTags.
        var relationsFields = TagRelations.find({
            tag: {
                $in: referenceTags
            }
        }, {
            fields: {
                _id: 0,
                relations: 1
            }
        }).fetch();

        // From the relations fields found, analyze the wanted tags relations.
        relationsFields.forEach(function(relationsField) {
            relationsField['relations'].forEach(function(relation) {
                // If it is in the referenceTags array then ignore it.
                if (referenceTags.indexOf(relation.tag) !== -1) {
                    return;
                }

                // Find the tag relation in the relatedTags array
                var relatedTag = relatedTags.filter(function(element) {
                    return element.tag === relation.tag;
                })[0];

                // Push the relation into the relatedTags array if the tag does
                //  not exist already, otherwise update the weight attribute.
                if (typeof relatedTag === "undefined") {
                    relatedTags.push(relation);
                } else {
                    relatedTag.weight += relation.weight;
                }
            });
        });

        // Sort the tags relations by its weight attributes.
        relatedTags.sort(function(a, b) {
            return b.weight - a.weight;
        });

        // Check if the limit parameter was specified.
        if (typeof limit === "undefined" || limit > relatedTags.length) {
            limit = relatedTags.length;
        }

        // Fill the tags array with just the tag names.
        for (var i = 0; i < limit; i++) {
            tags.push(relatedTags[i].tag);
        }

        return tags;
    }
});