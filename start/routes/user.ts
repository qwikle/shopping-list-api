import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.patch('/', 'UserController.update').middleware(['auth'])
  
  }).prefix('user').middleware(['auth'])