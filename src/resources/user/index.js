// const mongoose = require('mongoose')
const passwordFeature = require('@admin-bro/passwords')
const argon2 = require('argon2')
const merge = require('lodash/fp/merge')
const { resourceName: roleResourceName } = require('./../role')
const isAccessGranted = require('./../../policies/isAccessGranted')

const resourceName = 'User'

module.exports = {
    resourceName,
    initResource,
    getSchema,
    getModel,
    getOptions,
    getFeatures,
}

function initResource(mongoose, { resourceSchema, resourceOptions, resourceFeatures }) {
    const schema = getSchema(mongoose, resourceSchema)

    return {
        resource: mongoose.model(resourceName, schema),
        options: getOptions(resourceOptions),
        features: getFeatures(resourceFeatures),
    }
}

function getModel(mongoose) {
    return mongoose.models[resourceName]
}

function getSchema(mongoose, baseSchema = {}) {
    const schema = merge(baseSchema, {
        email: { type: String, required: true },
        password: { type: String, required: true },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: roleResourceName,
            required: false,
        },
    })

    return new mongoose.Schema(schema)
}

function getOptions(resourceOptions = {}) {
    const baseOptions = {
        properties: {
            password: {
                isVisible: false,
            },
            plainTextPassword: {
                type: 'password',
                isVisible: {
                    list: false,
                    edit: true,
                    filter: false,
                    show: false,
                },
            },
        },
        actions: {
            search: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'list' }),
            },
            show: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'show' }),
            },
            list: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'list' }),
            },
            new: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'edit' }),
                before: transformPassword,
            },
            edit: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'edit' }),
            },
            delete: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'delete' }),
            },
            bulkDelete: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'bulkDelete' }),
            },
        },
    }

    return merge(resourceOptions, baseOptions)
}

function getFeatures(resourceFeatures = []) {
    return [
        ...resourceFeatures,
        passwordFeature({
            properties: {
                password: 'plainTextPassword',
                encryptedPassword: 'password',
            },
            hash: argon2.hash,
        }),
    ]
}

async function transformPassword(request) {
    if (request.payload.plainTextPassword) {
        request.payload = {
            ...request.payload,
            password: await argon2.hash(request.payload.plainTextPassword),
            plainTextPassword: undefined,
        }
    }

    return request
}
