import Lists from '/imports/models/lists.js';

Lists.allow({
    insert(userId, list){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, list, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, list){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('lists', function (selector) {
      selector = {};
      return Lists.find(selector);
});

Meteor.methods({
            deleteList(userDel){
              Lists.remove({_id: userDel});
            }
})
