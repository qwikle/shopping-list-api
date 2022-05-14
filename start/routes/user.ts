import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.patch('/', 'UserController.update')
    Route.delete('/', 'UserController.delete')
  }).prefix('user').middleware(['auth'])