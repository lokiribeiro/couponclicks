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

Meteor.methods({
    upsertCouponCode(listID, ipAddress){
        console.log(listID);
        console.log(ipAddress);
        var status = 'claimed';
        var selector = {listID: listID};
        var modifier = {$set: {
            ipAddress: ipAddress, status: status
          }};
        var codesUpsert = Codes.upsert(selector, modifier);
        return codesUpsert;
      },

});
