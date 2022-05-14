import Hash from '@ioc:Adonis/Core/Hash'
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
    if(payload.oldPassword != null) {
      if(await Hash.verify(auth.user!.password, payload.oldPassword)){
        delete payload.oldPassword
      } else {
        return response.badRequest({message: 'invalid password'})
      }
    }
    await auth.user!.merge(payload).save()
    return response.send(payload)
  }
}
