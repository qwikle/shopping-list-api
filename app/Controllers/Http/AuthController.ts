import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Event from '@ioc:Adonis/Core/Event'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'
import Utils from '../../../services/utils/utils'
import EmailValidator from 'App/Validators/EmailValidator'

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
        await trx.commit()
        return response.created({ message: 'account created' })
      } catch (e) {
        await trx.rollback()
        console.log(e)
        return response.badRequest('An error occured')
      }
    })
  }

  public async forgotPassword({ request, response } : HttpContextContract) {
    const { email } = await request.validate(EmailValidator)
    const user = await User.findBy('email', email)
    if (!user) {
      return response.badRequest({ message: 'User not found' })
    }
    const token = await Utils.setToken(email)
    Event.emit('user:forgotPassword', { user, token })
    return response.created({ message: 'Token sent' })
  }

}
