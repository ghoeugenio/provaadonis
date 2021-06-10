'use strict'

const Game = use('App/Models/Game')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with games
 */
class GameController {
  /**
   * Show a list of all games.
   * GET games
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const game = await Game.query().fetch()

    return game
  }

  /**
   * Create/save a new game.
   * POST games
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const data = request.only([
      'type',
      'description',
      'range',
      'price',
      'max-number',
      'color',
      'min-cart-value'
    ])
    try {
      const game = await Game.create({ ...data })

      return game
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro ao cadastrar jogo' } })
    }
  }

  /**
   * Display a single game.
   * GET games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    try {
      const game = await Game.findOrFail(params.id)

      return game
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Jogo não encontrado' } })
    }
  }

  /**
   * Update game details.
   * PUT or PATCH games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const data = request.only([
      'type',
      'description',
      'range',
      'price',
      'max-number',
      'color',
      'min-cart-value'
    ])

    try {
      const game = await Game.findOrFail(params.id)

      game.merge(data)

      await game.save()

      return game
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro ao editar jogo' } })
    }
  }

  /**
   * Delete a game with id.
   * DELETE games/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    try {
      const game = await Game.findOrFail(params.id)

      game.delete()
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro ao apagar jogo' } })
    }
  }
}

module.exports = GameController
