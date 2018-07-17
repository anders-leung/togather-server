module.exports = function(promise) {
    return promise.then(data => {
        return [null, data];
    })
    .catch(err => {
        console.log('to err: ', err);
        return [err, null];
    });
 }