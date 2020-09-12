//const mongoose = require('mongoose')
const merge = require('lodash/fp/merge')
const isAccessGranted = require('./../../policies/isAccessGranted')

const resourceName = 'Role'

module.exports = {
    resourceName,
    initResource,
    getSchema,
    getModel,
    getOptions,
    getFeatures,
}

function initResource(mongoose, { resourceSchema, resourceOptions, resourceFeatures } = {}) {
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
    const allModels = [...mongoose.modelNames(), resourceName]

    const schema = new mongoose.Schema({
        ...baseSchema,
        name: { type: String, required: true },
        super_admin: { type: Boolean, required: false },
        grants: [
            {
                resource: {
                    type: String,
                    enum: allModels,
                },
                actions: [
                    {
                        action: {
                            type: String,
                            enum: ['*', 'search', 'show', 'list', 'new', 'edit', 'delete', 'bulkDelete'],
                        },
                    },
                ],
            },
        ],
    })

    return schema
}

function getOptions(resourceOptions = {}) {
    const baseOptions = {
        actions: {
            search: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'show' }),
            },
            show: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'show' }),
            },
            list: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'list' }),
            },
            new: {
                isAccessible: isAccessGranted({ resourceName: resourceName, actionRequested: 'edit' }),
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
    return [...resourceFeatures]
}
