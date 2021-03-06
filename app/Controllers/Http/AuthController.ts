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
import CheckTokenValidator from 'App/Validators/CheckTokenValidator'

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
        await user.load('profile')
        const token = await TokenUtils.setToken(email, TokenType.CHECK_EMAIL)
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
    await user!.load('profile')
    const token = await TokenUtils.setToken(email, TokenType.RESET_PASSWORD)
    await Event.emit('user:forgotPassword', { user, token })
    return response.created({ message: 'Token sent.' })
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    const { email, token, password } = await request.validate(ResetPasswordValidator)
    const user = await User.findBy('email', email)
    if (!(await TokenUtils.checkToken(email, token, TokenType.RESET_PASSWORD))) {
      return response.badRequest({ message: 'Invalid token.' })
    }
    await user!.merge({ password }).save()
    await TokenUtils.deleteToken(email, TokenType.RESET_PASSWORD)
    await user!.load('profile')
    await Event.emit('user:resetedPassword', { user: user! })
    return response.send({ message: 'Password updated.' })
  }

  public async verifyEmail({ request, response, auth }: HttpContextContract) {
    const { email, token } = await request.validate(VerifyEmailValidator)
    const user = auth.user
    if (!(await TokenUtils.checkToken(email, token, TokenType.CHECK_EMAIL))) {
      return response.badRequest({ message: 'Invalid token.' })
    }
    await user!.merge({ verified: true }).save()
    await TokenUtils.deleteToken(email, TokenType.CHECK_EMAIL)
    await user!.load('profile')
    Event.emit('user:verified', { user: user! })
    return response.send({ message: 'Email verified.' })
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.noContent()
  }

  public async checkToken({ request, response }: HttpContextContract) {
    const { email, token } = await request.validate(VerifyEmailValidator)
    if ((await TokenUtils.checkToken(email, token, TokenType.CHECK_EMAIL))) {
      return response.redirect().withQs({ email, token }).toPath('/verify-email')
    } if ((await TokenUtils.checkToken(email, token, TokenType.RESET_PASSWORD))) {
      return response.send({message: 'Reset password.'})
    }
    return response.badRequest({ message: 'Invalid token.' })
  }

  public async resendVerificationCode({ request, response }: HttpContextContract) {
    const { email, type } = await request.validate(CheckTokenValidator)
    const user = await User.findBy('email', email)
    if (user!.verified) {
      return response.badRequest({ message: 'User already verified.' })
    }
    if(await TokenUtils.searchToken(email, type)) {
      await TokenUtils.deleteToken(email, type)
    }
    const token = await TokenUtils.setToken(email, type)
    await user!.load('profile')
    await Event.emit('user:verifyEmail', { user: user!, token })
    return response.created({ message: 'Token sent.' })
  }
}
