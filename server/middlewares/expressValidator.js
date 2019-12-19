`use strict`

const { body, validationResult } = require('express-validator')
const userValidator = () => {
  return [
    body('email').isEmail().withMessage('please input a valid email'),
    body('password').isLength({ min: 6 }).withMessage('minimum password is 6 characters'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const messages = []
  errors.array().map(err => messages.push(err.msg ))
  next({
      status : 400,
      message : messages
  })
}

module.exports = {
  userValidator,
  validate,
}