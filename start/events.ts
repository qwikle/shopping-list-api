import Event from '@ioc:Adonis/Core/Event'
Event.on('user:forgotPassword', 'User.onForgotPassword')
Event.on('user:verifyEmail', 'User.onVerifyEmail')