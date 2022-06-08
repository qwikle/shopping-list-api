import Event from '@ioc:Adonis/Core/Event'
Event.on('user:forgotPassword', 'User.onForgotPassword')
Event.on('user:verifyEmail', 'User.onVerifyEmail')
Event.on('user:verified', 'User.onVerified')
Event.on('user:resetedPassword', 'User.onResetedPassword')
