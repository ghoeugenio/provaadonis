'use strict'

const User = use('App/Models/User')

class UserController {
  async store({ request, response }) {
    const data = request.only(['name', 'email', 'password'])

    try {
      const user = await User.create(data)

      return user
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro ao fazer login' } })
    }
  }

  async update({ auth, request, response }) {
    try {
      const user = await User.findOrFail(auth.user.id)
      const data = request.only(['name', 'email', 'password'])
      user.merge(data)

      await user.save()

      return user
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Erro ao editar usuário' } })
    }
  }

  async show({ auth, request, response }) {
    try {
      const user = await User.findOrFail(auth.user.id)

      return user
    } catch (error) {
      return response
        .status(error.status)
        .send({ error: { message: 'Jogo não encontrado' } })
    }
  }
}

module.exports = UserController
