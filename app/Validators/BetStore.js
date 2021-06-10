'use strict'
const Antl = use('Antl')
class BetStore {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      cart: 'array|required',
      'cart.*.game_id': 'required',
      'cart.*.numbers': 'required',
      'cart.*.price': 'required',
      'cart.*.date': 'date|required',
      totalPrice: 'required'
    }
  }

  get messages() {
    return Antl.list('validation')
  }
}

module.exports = BetStore
