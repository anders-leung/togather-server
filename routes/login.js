let express = require('express');
let router = express.Router();

let user = global.db.collection('user');
let send = require('./helpers/send');
let compare = require('./helpers/password').compare;
let to = require('./helpers/to');

router.get('/:username/:password', async (req, res) => {   
    let err, result;
    await user
            .where('username', '==', req.params.username)
            .get().then(snapshot => {
                if (snapshot.size !== 1) err = new Error('Unknown user with username ' + req.params.username);
                else result = snapshot.docs[0].data();
    });

    [err, result] = await to(compare(req.params.password, result.password));

    send(err, result, res);
});

module.exports = router;