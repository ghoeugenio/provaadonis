'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/users', 'UserController.store').validator('User')
Route.post('/sessions', 'SessionController.store').validator('Session')
Route.post('/logout', 'LogoutController.store')
Route.post('/password', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('/password', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.resource('game', 'GameController')
  .apiOnly()
  .validator(new Map([[['game.store'], ['Game']]]))

Route.group(() => {
  Route.put('/users', 'UserController.update')
  Route.get('/users', 'UserController.show')

  Route.get('games/bet/all', 'BetController.index')
  Route.get('games/bet/:id', 'BetController.show')
  Route.post('games/bet', 'BetController.store').validator('BetStore')
  Route.put('games/bet/:id', 'BetController.update').validator('BetUpdate')
  Route.delete('games/bet/:id', 'BetController.destroy')
}).middleware(['auth'])
