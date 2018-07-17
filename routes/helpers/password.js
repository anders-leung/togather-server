let bcrypt = require('bcrypt');
let to = require('./to');

module.exports = {
    encrypt: async (password) => {
        return await to(bcrypt.hash(password, 10));
     },
     
    compare: async (plainPass, hash) => {
        return await bcrypt.compare(plainPass, hash)
    }
}