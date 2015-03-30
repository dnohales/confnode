Meteor.methods({
    /**
     * Obtains an array of tags related to the ones provideed,
     *  sorted in descending order by the relation's strength.
     * @param {Array|string} referenceTags The tags to search related tags for.
     * @param {int} limit (Optional) Limits the amount of elements the
     *  returned array contains.
     * @returns {Array|string} The tags related to the ones provided.
     */
    getRelatedTags: function (referenceTags, limit) {
        var tagRelations = [];

        // For each provided tag, get its related tags (with its weights)
        //  and merge them into one array: [{tag: string, weight: int}]
        referenceTags.forEach(function (tag) {
            tagRelations = mergeTagRelations(tagRelations, getTagRelations(tag));
        });

        if (tagRelations.length === 0) {
            return tagRelations;
        }

        // Sort the resulting array by its elements' weight attribute.
        tagRelations.sort(function (a, b) {
            return b.weight - a.weight;
        });

        // Remove from the related tags found the ones that were searched for.
        referenceTags.forEach(function (referenceTag) {
            var length = tagRelations.length;
            for (var i = 0; i < length; i++) {
                if (referenceTag === tagRelations[i].tag) {
                    tagRelations.splice(i, 1);
                    break;
                }
            }
        });

        // Return a string array with just the tags.
        return cleanTags(tagRelations, limit);
    }
});

/**
 * Merges two arrays of type: [{tag: string, weight: int}] into one.
 *  Produces the union of the two provided arrays where the keys are the
 *  element's 'tag' attributes.
 *  If the same 'tag' attribute exists in both arrays, the resulting element
 *  will have the sum of both of the element's 'weight' attributes.
 * @param {Array|{tag: string, weight: int}} relations1 One of the arrays.
 * @param {Array|{tag: string, weight: int}} relations2 Another of the arrays.
 * @returns {Array|{tag: string, weight: int}} The array that results from the
 *  merging operation.
 */
function mergeTagRelations(relations1, relations2) {
    relations1.forEach(function (relation1) {
        var relation2 = relations2.filter(function (relation) {
            return relation.tag === relation1.tag;
        })[0];
        if (typeof relation2 === "undefined") {
            relations2.push(relation1);
        }
        else {
            relation2.weight += relation1.weight;
        }
    });
    return relations2;
}

/**
 * Searches and produces the relations of a provided tag.
 * @param {string} referenceTag The tag to search related tags for.
 * @returns {Array|{tag: string, weight: int}} The related tags with its
 *  respective calculated weights. This returned array is not sorted.
 */
function getTagRelations(referenceTag) {
    // Get tags related to the one requested
    var tagLocator = new RegExp('^' + referenceTag + '$', 'i');
    var relations = Rooms.find({
        tags: {
            $in: [tagLocator]
        }}, {
        fields: {
            _id: 0,
            tags: 1
        }
    }).fetch();

    // Calculate the found tags' weights
    var ponderedRelations = [];
    relations.forEach(function (relatedTags) {
        relatedTags['tags'].forEach(function (tag) {
            // If it is not the tag requested, then analyze it
            if (!tag.match(tagLocator)) {

                var relation = ponderedRelations.filter(function (relation) {
                    return relation.tag === tag;
                })[0];

                // If it is the first occurrence of this tag, save it
                if (typeof relation === "undefined") {
                    ponderedRelations.push({
                        'tag': tag,
                        'weight': 1
                    });
                }
                else {
                    relation.weight++;
                }
            }
        });
    });

    return ponderedRelations;
}

/**
 * From an array of type: [{tag: string, weight: int}], returns an array with
 *  only its elements' tag attributes. Limiting the amount of elements returned
 *  if indicated so.
 * @param {Array|{tag: string, weight: int}} tagRelations The
 * @param {int} limit (Optional) Limits the amount of elements the returned
 *  array contains.
 * @returns {Array|string} Tags from the provided parameters.
 */
function cleanTags(tagRelations, limit) {
    var tags = [];
    if (typeof limit === "undefined" || limit > tagRelations.length) {
        limit = tagRelations.length;
    }
    for (var i = 0; i < limit; i++) {
        tags.push(tagRelations[i].tag);
    }
    return tags;
}