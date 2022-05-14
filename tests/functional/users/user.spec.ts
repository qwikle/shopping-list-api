import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'


test('retrieve user informations', async ({client}) => {
  const user = await UserFactory.with('profile', 1).create()
  const response = client.get('/user').loginAs(user)
  await (await response).assertAgainstApiSpec()
})


test('update user email or password', async ({ client }) => {
  const user = await UserFactory.with('profile', 1).create()
  const response = client
    .patch('/user')
    .json({
      password: 'Aazaaz69',
      passwordConfirmation: 'Aazaaz69',
      oldPassword: 'Aazaaz69',
      email: 'user@example.com',
      emailConfirmation: 'user@example.com',
    })
    .loginAs(user)
  ;(await response).assertAgainstApiSpec()
})
