const MongooseStore = require('./mongoose_store');

function Limiter(options){
    const {
        Store = MongooseStore,
        Model, 
        lifeTimeMs, 
        max, 
        message
    } = options;
    
    return (req, res, next) => {
        Store.incr(req.ip, lifeTimeMs, Model, (err, hits, expirationDate) => {
            if(err){
                console.log(err);
                return res.send(err);
            }
            if(expirationDate < new Date(Date.now()))
                Store.resetKey(req.ip, Model);
            else if(hits >= max) 
                return res.send(message);
            return next();
        })
    }
}

module.exports = Limiter;
