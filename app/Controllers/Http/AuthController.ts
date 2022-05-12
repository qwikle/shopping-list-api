import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import LoginValidator from 'App/Validators/LoginValidator'
import RegisterValidator from 'App/Validators/RegisterValidator'

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
        return response.send({ message: 'account created' })
      } catch (e) {
        await trx.rollback()
        console.log(e)
        return response.badRequest('An error occured')
      }
    })
  }
}
