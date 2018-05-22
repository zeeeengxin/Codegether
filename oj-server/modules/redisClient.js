var redis = require('redis');
// we only want to create on redis instance and use the same one everywhere
var client = redis.createClient();

function set(key, value, callback) {
    client.set(key, value, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
        callback(res);
    });
}

function get(key, callback) {
    client.get(key, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }
         callback(res);
    })
}

function expire(key, timeInSeconds) {
    client.expire(key, timeInSeconds);
}

function quit() {
    client.quit();
}

module.exports = {
    get: get,
    set: set,
    expire: expire,
    quit: quit,
    redisPrint: redis.print
}
