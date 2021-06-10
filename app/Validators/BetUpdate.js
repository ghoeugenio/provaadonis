'use strict'
const Antl = use('Antl')
class BetUpdate {
  get validateAll() {
    return true
  }

  get rules() {
    return {
      numbers: 'required',
      price: 'required'
    }
  }

  get messages() {
    return Antl.list('validation')
  }
}

module.exports = BetUpdate
