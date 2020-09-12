const { expect } = require('chai')
const isGranted = require('../src/policies/isGranted')

describe('policies/isGranted', function () {
    it('returns false. resource not granted', async function () {
        const role = {
            super_admin: false,
            grants: [
                {
                    _id: '1',
                    resource: 'Resource1',
                    actions: [
                        {
                            _id: '12',
                            action: '*',
                        },
                    ],
                },
                {
                    _id: '1',
                    resource: 'Resource2',
                    actions: [
                        {
                            _id: '12',
                            action: '*',
                        },
                    ],
                },
            ],
        }

        expect(isGranted('RequestedResource', 'actionRequested', role)).to.be.false
    })

    it('returns false. resource granted but action not authorized', async function () {
        const role = {
            super_admin: false,
            grants: [
                {
                    _id: '1',
                    resource: 'RequestedResource',
                    actions: [
                        {
                            _id: '12',
                            action: 'wont find action',
                        },
                    ],
                },
                {
                    _id: '1',
                    resource: 'Resource2',
                    actions: [
                        {
                            _id: '12',
                            action: 'wont find action',
                        },
                    ],
                },
            ],
        }

        expect(isGranted('RequestedResource', 'actionRequested', role)).to.be.false
    })

    it('returns true. resource granted and action authorized', async function () {
        const role = {
            super_admin: false,
            grants: [
                {
                    _id: '1',
                    resource: 'RequestedResource',
                    actions: [
                        {
                            _id: '12',
                            action: 'actionRequested',
                        },
                    ],
                },
                {
                    _id: '1',
                    resource: 'Resource2',
                    actions: [
                        {
                            _id: '12',
                            action: 'another action',
                        },
                    ],
                },
            ],
        }

        expect(isGranted('RequestedResource', 'actionRequested', role)).to.be.true
    })

    it('returns true. all actions to resource authorized (*)', async function () {
        const role = {
            super_admin: false,
            grants: [
                {
                    _id: '1',
                    resource: 'RequestedResource',
                    actions: [
                        {
                            _id: '12',
                            action: '*',
                        },
                    ],
                },
                {
                    _id: '1',
                    resource: 'Resource2',
                    actions: [
                        {
                            _id: '12',
                            action: 'another action',
                        },
                    ],
                },
            ],
        }

        expect(isGranted('RequestedResource', 'actionRequested', role)).to.be.true
    })

    it('returns true when is super admin role', async function () {
        const role = {
            super_admin: true,
            grants: [],
        }

        expect(isGranted('RequestedResource', 'actionRequested', role)).to.be.true
    })
})
