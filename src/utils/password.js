const argon2 = require('argon2')

module.exports = {
    async generateHash(plainPassword) {
        return argon2.hash(plainPassword)
    },
}
