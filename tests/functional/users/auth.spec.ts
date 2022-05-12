import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
test('register a new account with profile', async ({ client }) => {
  const response = client.post('/auth/register').json({
    firstName: 'Ahmed',
    lastName: 'Mahmoud',
    email: 'qwikle@gmail.com',
    birthDay: '18/08/1988',
    password: 'Aazaaz69',
    email_confirmation: 'qwikle@gmail.com',
    password_confirmation: 'Aazaaz69',
  })
  ;(await response).assertStatus(201)
})

test('login with credentials', async ({ client }) => {
  const response = client.post('/auth/login').json({
    email: 'qwikle@gmail.com',
    password: 'Aazaaz69',
  })
  ;(await response).assertStatus(200)
})

test('update email address', async ({ client }) => {
  const user = await UserFactory.with('profile', 1).create()
  console.log(user.toJSON())
  const response = client
    .post('/auth/update-email')
    .json({
      email: 'aler@gmail.com',
      email_confirmation: 'aler@gmail.com',
    })
    .loginAs(user)
  ;(await response).assertBody({message: 'email changed'})
})
