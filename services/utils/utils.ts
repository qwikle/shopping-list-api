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

    public static async setToken(email: string, type: TokenType) {
        const token = TokenUtils.makeId(6)
        await Redis.set(`mobile:${type}:token${email}`, token)
        await Redis.expire(`mobile:${type}:token${email}`, 43200)
        return token
    }

    public static searchToken(email: string, type: TokenType): Promise<string | null> { 
        return Redis.get(`mobile:${type}:token${email}`)
    }

    public static async deleteToken(email: string, type: TokenType) {
        await Redis.del(`mobile:${type}:token${email}`)
    }

    public static async checkToken(email: string, token: string, type: TokenType): Promise<boolean> {
        const t = await Redis.get(`mobile:${type}:token${email}`)
        return t === token
    }
}

export enum TokenType { verifyEmail = 'verifyEmail', resetPassword = 'resetPassword', }