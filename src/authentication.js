const argon2 = require('argon2')

module.exports = {
    authenticationClosure({ userModel, roleModel }) {
        return function (email, password) {
            return authentication(email, password, userModel, roleModel)
        }
    },
    authentication,
}

async function authentication(email, password, userModel, roleModel) {
    const user = await userModel.findOne({ email })

    if (!user) return false

    const matched = await argon2.verify(user.password, password)
    if (!matched) return false

    return {
        ...user._doc,
        role: await roleModel.findById(user.role),
    }
}
