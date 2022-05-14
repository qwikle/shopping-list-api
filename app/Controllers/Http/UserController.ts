import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async index({ auth }: HttpContextContract) {
    const user = await User.query().where('id', auth.user!.id).preload('profile').first()
    return user
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(UpdateUserValidator)
    await auth.user!.merge(payload).save()
    return response.send(payload)
  }
}
