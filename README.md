# express-mongoose-rate-limit
A simple, 0 dependency, rate limiter for Express and Mongoose.
```
const mongoose = require('mongoose');

mongoose.connect(YOUR_MONGO_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, '!%! Error on connection to MongoDB...'));
db.once('open', function(){ console.log('% MongoDB connection success...'); });

let limitSchema = new mongoose.Schema({ 
    ip: String,
    expireAt: {
        type: Date,
        default: Date.now
    },
    counter: Number
});

let Limit = mongoose.model('limit', limitSchema);
```
