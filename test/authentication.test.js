const { expect } = require('chai')
const { stub } = require('sinon')
const argon2 = require('argon2')
const { authenticationClosure } = require('../src/authentication')

describe('authentication', function () {
    it('returns false. user email not found', async function () {
        const userModelStub = {
            findOne: stub().returns(null),
        }
        const authentication = authenticationClosure({ userModel: userModelStub })
        const matched = await authentication('email@email.com', 'test')

        expect(matched).to.be.false
    })

    it('returns false. password doesnt match', async function () {
        const userModelStub = {
            findOne: stub().returns({ email: 'email@email.com', password: await argon2.hash('differentPassword') }),
        }
        const authentication = authenticationClosure({ userModel: userModelStub })
        const matched = await authentication('email@email.com', '$1')

        expect(matched).to.be.false
    })

    it('returns true. user matched', async function () {
        const userModelStub = {
            findOne: stub().returns({
                email: 'email@email.com',
                password: await argon2.hash('123'),
                _doc: {
                    email: 'email@email.com',
                },
            }),
        }
        const roleModelStub = {
            findById: stub().returns({}),
        }
        const authentication = authenticationClosure({ userModel: userModelStub, roleModel: roleModelStub })
        const matched = await authentication('email@email.com', '123')

        expect(matched).to.not.be.false
        expect(matched).to.contains.keys('email', 'role')
    })
})
