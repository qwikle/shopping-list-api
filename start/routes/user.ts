import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/', 'UserController.index')
    Route.patch('/update', 'UserController.update').middleware(['auth'])
  
  }).prefix('user').middleware(['auth'])