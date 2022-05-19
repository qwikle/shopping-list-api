import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.resource('/', 'ProductListController')
})
    .prefix('product-list')
    .middleware(['auth'])