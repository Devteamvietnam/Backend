const express = require('express')
// const router = express.Router()
const router = require('express-promise-router')()

const UserController = require('../controllers/user')

const { validateBody, validateParam, schemas } = require('../helpers/validator')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')

router.route('/users')
    .get(UserController.index)
    .post(validateBody(schemas.userSchema), UserController.newUser)

router.route('/users/signup').post(validateBody(schemas.authSignUpSchema), UserController.signUp)

router.route('/users/signin').post(validateBody(schemas.authSignInSchema), passport.authenticate('local', { session: false }), UserController.signIn)

router.route('/users/secret').get(passport.authenticate('jwt', { session: false }), UserController.secret)

router.route('/users/:userID')
    .get(validateParam(schemas.idSchema, 'userID'), UserController.getUser)
    .put(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), UserController.replaceUser)
    .patch(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOptionalSchema), UserController.updateUser)

router.route('/users/:userID/decks')
    .get(validateParam(schemas.idSchema, 'userID'), UserController.getUserDecks)
    .post(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.deckSchema), UserController.newUserDeck)

module.exports = router
