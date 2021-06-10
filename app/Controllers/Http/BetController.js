'use strict'

const Bet = use('App/Models/Bet')
const Game = use('App/Models/Game')
const Mail = use('Mail')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bets
 */
class BetController {
  /**
   * Show a list of all bets.
   * GET bets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, request, response, view }) {
    const userId = auth.user.id

    const bet = await Bet.query().where({ user_id: userId }).paginate(1, 2)

    return bet
  }

  /**
   * Render a form to be used for creating a new bet.
   * GET bets/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new bet.
   * POST bets
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ params, request, response, auth }) {
    const { cart, totalPrice } = request.all()
    const minCartValue = 30

    if (totalPrice < minCartValue) {
      return response
        .status(401)
        .send({ error: { message: 'Carrinho abaixo do valor mínimo!' } })
    }
    const user = auth.user

    const sendGamesToEmail = []

    for (let i = 0; i < cart.length; i++) {
      const game = await Game.findByOrFail({ id: cart[i].game_id })

      const date = new Date(cart[i].date)

      Bet.create({
        game_id: game.id,
        user_id: user.id,
        numbers: cart[i].numbers,
        price: cart[i].price
      })

      const gamesToEmail = {
        name: user.name,
        type: game.type,
        price: cart[i].price.toFixed(2).toString().replace(/[.]/, ','),
        numbers: cart[i].numbers.split(','),
        date: date.toLocaleDateString()
      }

      sendGamesToEmail.push(gamesToEmail)
    }

    await Mail.send(
      ['emails.newBet'],
      {
        name: user.name,
        sendGamesToEmail,
        totalPrice: totalPrice.toFixed(2).toString().replace(/[.]/, ',')
      },
      (message) =>
        message.to(user.email).from('tgl@client.com').subject('Nova aposta!')
    )
  }

  /**
   * Display a single bet.
   * GET bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    try {
      const bet = await Bet.findOrFail(params.id)

      return bet
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Jogo não encontrado' } })
    }
  }

  /**
   * Update bet details.
   * PUT or PATCH bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const data = request.only(['game_id', 'numbers', 'price'])

    try {
      const bet = await Bet.findOrFail(params.id)

      bet.merge(data)

      await bet.save()

      return bet
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro ao editar jogo' } })
    }
  }

  /**
   * Delete a bet with id.
   * DELETE bets/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const bet = await Bet.findOrFail(params.id)

      bet.delete()
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro ao apagar jogo' } })
    }
  }
}

module.exports = BetController
