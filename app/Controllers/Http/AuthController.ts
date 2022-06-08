import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Event from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import TokenUtils, { TokenType } from '../../../services/utils/utils'
import EmailValidator from 'App/Validators/EmailValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import VerifyEmailValidator from 'App/Validators/VerifyEmailValidator'

export default class AuthController {
  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator)
    try {
      const token = await auth.use('api').attempt(email, password)
      return token
    } catch {
      return response.badRequest({ message: 'Invalid credentials' })
    }
  }

  public async register({ request, response }: HttpContextContract) {
    const { email, password, firstName, lastName, birthDay } = await request.validate(
      RegisterValidator
    )
    await Database.transaction(async (trx) => {
      try {
        const user = await User.create({ email, password })
        user.useTransaction(trx)
        await user.save()
        await user.related('profile').create({ firstName, lastName, birthDay })
        const token = await TokenUtils.setToken(email, TokenType.verifyEmail)
        await Event.emit('user:verifyEmail', { user, token })
        await trx.commit()
        return response.created({ message: 'account created' })
      } catch (e) {
        await trx.rollback()
        console.log(e)
        return response.badRequest('An error occured')
      }
    })
  }

  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email } = await request.validate(EmailValidator)
    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'User not found' })
    }
    await user.load('profile')
    const token = await TokenUtils.setToken(email, TokenType.resetPassword)
    await Event.emit('user:forgotPassword', { user, token })
    return response.created({ message: 'Token sent' })
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    const { email, token, password } = await request.validate(ResetPasswordValidator)
    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'User not found' })
    }
    if (!(await TokenUtils.checkToken(email, token, TokenType.resetPassword))) {
      return response.badRequest({ message: 'Invalid token' })
    }
    await user.merge({ password }).save()
    await TokenUtils.deleteToken(email, TokenType.resetPassword)
    return response.send({ message: 'Password updated' })
  }

  public async verifyEmail({ request, response }: HttpContextContract) {
    const { email, token } = await request.validate(VerifyEmailValidator)
    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'User not found' })
    }
    if (!(await TokenUtils.checkToken(email, token, TokenType.verifyEmail))) {
      return response.badRequest({ message: 'Invalid token' })
    }
    await user.merge({ verified: true }).save()
    await TokenUtils.deleteToken(email, TokenType.verifyEmail)
    return response.send({ message: 'Email verified' })
  }
}
