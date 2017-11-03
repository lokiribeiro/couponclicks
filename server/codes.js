import Codes from '/imports/models/codes.js';

Codes.allow({
    insert(userId, code){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, code, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, code){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('codes', function () {      
      return Codes.find();
});
