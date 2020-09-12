const isGranted = require('./isGranted')

module.exports = function isAccessGranted({ resourceName, actionRequested }) {
    return ({ currentAdmin }) => {
        return isGranted(resourceName, actionRequested, currentAdmin.role)
    }
}
