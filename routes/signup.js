let express = require('express');
let router = express.Router();

let user = global.db.collection('user');
let send = require('./helpers/send');
let encrypt = require('./helpers/password').encrypt;

router.post('/', async (req, res) => {
    let doc = req.body.doc;
    delete req.body.doc

    let err, result;
    [err, result] = await encrypt(req.body.password);
    if (err) return send(err, false, res);
    req.body.password = result;

    result = await user.doc(doc).set(req.body);
    if (typeof result !== 'object' || result.constructor.name !== 'WriteResult') {
        err = new Error('Error adding new user.')
    }
    result = true;

    send(err, result, res);
});

module.exports = router;