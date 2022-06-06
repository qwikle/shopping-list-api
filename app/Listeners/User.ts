import type { EventsList } from '@ioc:Adonis/Core/Event'
import ForgotPassword from 'App/Mailers/ForgotPassword'

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
}