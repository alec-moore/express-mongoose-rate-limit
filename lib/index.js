const MongooseStore = require('./mongoose_store');

function Limiter(options){
    let {Model, lifeTimeMs, max, message, store = MongooseStore} = options;
    return (req, res, next) => {
        store.incr(req.ip, lifeTimeMs, Model, (err, hits, expirationDate) => {
            if(err){
                console.log(err);
                return res.send(err);
            }
            if(expirationDate < new Date(Date.now()))
                store.resetKey(req.ip, Model);
            else if(hits >= max) return res.send(message);
            return next();
        })
    }
}

module.exports = Limiter;