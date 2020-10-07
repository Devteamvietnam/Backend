
 const User = require('../models/User')
 const Deck = require('../models/Deck')

 const JWT = require('jsonwebtoken')
 const { JWT_SECRET } = require('../configs/index')
 const endcodedToken = (userID) => {
   return JWT.sign({
    iss: 'Dinh Duc Thien',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 365)
   }, JWT_SECRET)
}


// async / await
// express-promise-router remove try catch
const index = async (req, res, next) => {
        const users = await User.find({})
        return res.status(200).json({users})
}

const newUser = async (req, res, next) => {
        const newUser = new User(req.value.body)
        await newUser.save()
        return res.status(201).json({user: newUser})
}


const getUserById = async (req, res, next) => {
    const { userID }= req.value.params
    const user = await User.findById(userID)
    return res.status(200).json({user})
}

const replaceUser = async (req, res, next) => {
    // enforce new user to old user
    const { userID } = req.value.params
    const newUser = req.value.body
    const result = await User.findByIdAndUpdate(userID, newUser)
    return res.status(200).json({success: true})
}

const updateUser = async (req, res, next) => {
    // number of fields
    const { userID } = req.value.params
    const newUser = req.value.body
    const result = await User.findByIdAndUpdate(userID, newUser)
    return res.status(200).json({success: true})

}

const getUserDeck = async (req, res, next) => {
    const { userID } = req.value.params
    // Get user
    const user = await User.findById(userID).populate('decks')
    return res.status(200).json({decks: user.decks})
}

const newUserDeck = async (req, res, next) => {
    const { userID } = req.value.params
    // create new deck
    const newDeck = new Deck(req.value.body)
    // Get user
    const user = await User.findById(userID)
    // Assign user a deck
    newDeck.owner = user
    //save
    await newDeck.save()
    //add Deck to user deck array 'decks'
    // error "Maximum call stack size exceeded" fix -> ._id
    user.decks.push(newDeck._id)
    // save the user
    await user.save()

    res.status(201).json({deck: newDeck})
}

const secret = async (req, res, next) => {
  return res.status(200).json({ resources : true})
}

const signin = async (req, res, next) => {}

const signup = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.value.body
  // check if there is a new user with the same user
  const foundUser = await User.findOne({ email })
  if (foundUser) return res.status(403).json({error: { message: 'Email already exists'}})
  // create new user
  const newUser = new User({firstName, lastName, email, password})
  newUser.save()
// endcodedToken
  const token = endcodedToken(newUser._id)
  res.setHeader('Authorization', token)

  return res.status(201).json({ success: true })
}

module.exports = {
    index,
    newUser,
    getUserById,
    replaceUser,
    updateUser,
    getUserDeck,
    newUserDeck,
    secret,
    signin,
    signup
}
