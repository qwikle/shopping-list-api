import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { CamelCaseNamingStrategy } from './camelCaseNamingStrategy'

export default class Profile extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  
  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column({ serializeAs: null })
  public userId: string

  @column()
  public avatar?: string

  @column.dateTime({serialize: (value: DateTime) => {
    return value.toFormat('dd/MM/yyyy')
  }})
  public birthDay: DateTime

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => User)
  public user: HasOne<typeof User>
}
