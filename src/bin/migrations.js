#!/usr/bin/env node
const { argv } = require('yargs')
const argon2 = require('argon2')
const mongoose = require('mongoose')
const roleResource = require('../resources/role')
const userResource = require('../resources/user')

const { connectionString } = argv

init()
async function init() {
    console.log('Initing migrations')
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    console.log('Connected to', connectionString)

    roleResource.initResource(mongoose, {})
    userResource.initResource(mongoose, {})

    const Role = roleResource.getModel(mongoose)
    const User = userResource.getModel(mongoose)

    console.log()
    console.log('\x1b[34mCreating Role')
    const roleId = mongoose.Types.ObjectId()
    await new Role({
        _id: roleId,
        name: 'Super Admin',
        super_admin: true,
    }).save()

    console.log('Creating User')
    const password = await argon2.hash('admin')
    await new User({
        email: 'admin@admin.com',
        password: password,
        role: roleId,
    }).save()

    await mongoose.disconnect()
    console.log()
    console.log('\x1b[42m\x1b[37m', 'Migration finished\x1b[0m')
    console.log('User: \x1b[4madmin@admin.com\x1b[0m')
    console.log('Password: \x1b[4madmin\x1b[0m')
}
