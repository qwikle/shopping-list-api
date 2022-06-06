import Redis from "@ioc:Adonis/Addons/Redis"

export default class Utils {
    public static makeId(length: number) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let charactersLength = characters.length
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
      }

    public static async setToken(email: string) {
        const token = Utils.makeId(6)
        await Redis.set(`mobile:verifyEmail:token${email}`, token)
        await Redis.expire(`mobile:verifyEmail:token${email}`, 1200)
        return token
    }
}
