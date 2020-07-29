# express-mongoose-rate-limit
A simple, 0 dependency, rate limiter for Express and Mongoose.

Here's an example of how to use this.

## For setup:
```
const mongoose = require('mongoose');

mongoose.connect(YOUR_MONGO_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error on connection to MongoDB.'));
db.once('open', () => { console.log('MongoDB connection success.'); });

const limitSchema = new mongoose.Schema({ 
    ip: String,
    expireAt: { // Prepare for MongoDB TTL
        type: Date,
        default: Date.now
    },
    counter: Number
});

const Limit = mongoose.model('limit', limitSchema);
```
## Now using it (the important part):
```
const rateLimiter = require('./lib'); // Or whatever folder index.js and mongoose_store.js are located.
const limiter = rateLimiter({
    Model: Limit, // Required
    lifeTimeMs: 60*1000, // Defaults to 1 minute if not provided
    max: 15, // Required
    message: "You've sent too many requests (15+) in the past minute.", // Required
});

app.get('/', limiter, (req, res) => res.send('Test!'));
```
