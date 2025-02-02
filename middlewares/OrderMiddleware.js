'use strict'
const models = require('../models')
const Order = models.Order
const Restaurant = models.Restaurant

const checkOrderOwnership = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: {
        model: Restaurant,
        as: 'restaurant'
      }
    })
    if (req.user.id === order.restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(404).send(err)
  }
}

// TODO: Implement the following function to check if the order belongs to current loggedIn customer (order.userId equals or not to req.user.id)
const checkOrderCustomer = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId)
    if (order.userId === req.user.id) {
      next()
    } else {
      return res.status(403).send('Not enough privilges. This entity does not belong to you')
    }
  } catch (error) {
    return res.status(404).send(error)
  }
}

const checkOrderVisible = (req, res, next) => {
  if (req.user.userType === 'owner') {
    checkOrderOwnership(req, res, next)
  } else if (req.user.userType === 'customer') {
    checkOrderCustomer(req, res, next)
  }
}

module.exports = {
  checkOrderOwnership: checkOrderOwnership,
  checkOrderCustomer: checkOrderCustomer,
  checkOrderVisible: checkOrderVisible
}
