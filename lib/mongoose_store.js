function incr(key, lifeTimeMs = 6000, Model, callback){
    const expiresAt = new Date(Date.now() + lifeTimeMs);
    const actions = {$inc: {counter: 1}};
    model.findOneAndUpdate({ip: key}, actions, {new: true}, (err, doc) => {
        if(err){ 
            console.log('MongooseStore: Error incrementing document:', err);
            return callback(err); 
        }
        if(!doc){ 
            // Create new document.
            //console.log('MongooseStore: Rate limit not found for this IP. Creating new rate limit document...')
            let newKey = new Model({
                ip: key,
                counter: 1,
                expiresAt: expiresAt
            });
            return newKey.save(err => {
                if(err) 
                    return callback(err);
                return callback(null, 1, expiresAt);
            });
        }
        else
            return callback(null, doc.counter + 1, expiresAt);  
    })  
}

function decrement(key, Model){
    const expiresAt = new Date(Date.now() + lifeTimeMs);
    const actions = {
        $inc: {counter: -1}, 
        $set: {expirationDate: expiresAt}
    };
    Model.findOneAndUpdate({ip: key}, actions, {new: true}, (err, doc) => {
        if(err) 
            return console.log('MongooseStore: Error decrementing document:', err);
        if(!doc) 
            return console.log('MongooseStore: No document found for decrement...');
        //return console.log('MongooseStore: Document decremented successfully.')
    })  
}

function resetKey(key, Model){
    Model.deleteOne({ip: key}, err => {
        if(err) 
            return console.log('MongooseStore: Error resetting document:', err);
        //console.log('MongooseStore: Document reset successfully.');
    })
}

module.exports = {
    incr,
    decrement,
    resetKey
};
