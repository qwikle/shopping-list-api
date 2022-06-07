import Redis from "@ioc:Adonis/Addons/Redis"

export default class TokenUtils {
    private static makeId(length: number) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let charactersLength = characters.length
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
      }

    public static async setToken(email: string) {
        const token = TokenUtils.makeId(6)
        await Redis.set(`mobile:verifyEmail:token${email}`, token)
        await Redis.expire(`mobile:verifyEmail:token${email}`, 43200)
        return token
    }

    public static searchToken(email: string): Promise<string | null> { 
        return Redis.get(`mobile:verifyEmail:token${email}`)
    }

    public static async deleteToken(email: string) {
        await Redis.del(`mobile:verifyEmail:token${email}`)
    }

    public static async checkToken(email: string, token: string): Promise<boolean> {
        const t = await Redis.get(`mobile:verifyEmail:token${email}`)
        return t === token
    }
}
