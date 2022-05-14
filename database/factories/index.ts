import Factory from '@ioc:Adonis/Lucid/Factory'
import Profile from 'App/Models/Profile'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
  password: 'Aazaaz69',
  }
})
  .relation('profile', () => ProfileFactory)
  .build()

//@ts-ignore
export const ProfileFactory = Factory.define(Profile, ({ faker }) => {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    birthDay: '18/08/1988',
    avatar: faker.internet.avatar(),
  }
}).build()
