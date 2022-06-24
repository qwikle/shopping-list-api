/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import './routes/user'
// import User from 'App/Models/User'
// import { DateTime } from 'luxon';

Route.post('/login', 'AuthController.login')
Route.post('/register', 'AuthController.register')
Route.post('/forgot-password', 'AuthController.forgotPassword')
Route.post('/reset-password', 'AuthController.resetPassword')
Route.get('/verify-email', 'AuthController.verifyEmail').middleware('auth')
Route.post('/resend-verification-code', 'AuthController.resendVerificationCode')
Route.post('/logout', 'AuthController.logout')
Route.post('/check-token', 'AuthController.checkToken')

// Route.get('/', async () => {
//   const user = User.create({
//     email: 'qwikle@gmail.com',
//     password: 'Aazaaz69',
//   })
//   ;(await user).related('profile').create({
//     firstName: 'Qwikle',
//     lastName: 'Qwikle',
//     birthDay: DateTime.fromISO('1988-01-01'),
//     })
//   return { hello: 'world' }
// })