import type { EventsList } from '@ioc:Adonis/Core/Event'
import ForgotPassword from 'App/Mailers/ForgotPassword'
import ResetedPassword from 'App/Mailers/ResetedPassword'
import VerifiedEmail from 'App/Mailers/VerifiedEmail'

export default class User {
  public async onForgotPassword(data: EventsList['forgot:password']) {
    const { user, token } = data
    try {
      const email = new ForgotPassword(user, token)
      await email.sendLater()
    } catch (error) {
      console.log(error)
    }
  }

  public async onVerifyEmail(data: EventsList['user:verifyEmail']) {
    const { user, token } = data
    try {
      const email = new ForgotPassword(user, token)
      await email.sendLater()
    } catch (error) {
      console.log(error)
    }
  }

  public async onVerified(data: EventsList['user:verified']) {
    const { user } = data
    try {
      const email = new VerifiedEmail(user)
      await email.sendLater()
    } catch (error) {
      console.log(error)
    }
  }

  public async onResetedPassword(data: EventsList['user:resetedPassword']) {
    const { user } = data
    try {
      const email = new ResetedPassword(user)
      await email.sendLater()
    } catch (error) {
      console.log(error)
    }
  }
}
