const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({ error: 'username missing' })
  }
  if (!password) {
    return response.status(400).json({ error: 'password missing' })
  }
  if (password.length < 3) {
    return response.status(400).json({ error: 'password is too short' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1 })

  if (!users) {
    return response.status(404).end()
  }
  response.json(users)
})

module.exports = usersRouter