module.exports = (err, result, res) => {
    console.log('send err: ', err)
    console.log('send result: ', result)
    if (err) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request\n');
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    }
}