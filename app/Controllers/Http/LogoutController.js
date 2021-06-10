'use strict'

class LogoutController {
  async store({ auth }) {
    const logout = await auth.logout()
    return logout
  }
}

module.exports = LogoutController
