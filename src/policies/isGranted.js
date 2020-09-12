module.exports = function isGranted(resourceName, actionRequested, role) {
    if (role.super_admin) return true

    return role.grants.some((grant) => {
        if (grant.resource !== resourceName) return false

        return isActionGranted(grant.actions, actionRequested)
    })
}

function isActionGranted(actions, actionRequested) {
    return actions.some((action) => {
        if (action.action === '*') return true
        if (action.action === actionRequested) return true

        return false
    })
}
