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
    },    
    upsertCode(couponCode, listID){
        var selector = {_id: listID};
        var status = 'unclaimed';
        var modifier = {$push: {codes: {coupon_code: couponCode, status: status }}}
        var listUpsert = Lists.update(selector, modifier);
        return listUpsert;
    }
})
