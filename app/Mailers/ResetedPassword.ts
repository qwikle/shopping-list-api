import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import User from 'App/Models/User'
import mjml from 'mjml'

export default class ResetedPassword extends BaseMailer {
  constructor(private user: User) {
    super()
  }
  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  public html = new Promise<string>(async (resolve) => {
    const html = mjml(await View.render('emails/reseted_password_mjml', { user: this.user })).html
    resolve(html)
  })

  /**
   * The prepare method is invoked automatically when you run
   * "VerifyEmail.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    message
      .subject('ShoppingList:[Adresse email vérifiée]')
      .from('admin@shoppingList.com')
      .to(this.user.email)
      .html(await this.html)
  }
}
