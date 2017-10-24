export default Lists = new Mongo.Collection('lists');

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
