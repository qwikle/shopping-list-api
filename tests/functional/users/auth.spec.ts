import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories';
test('register a new account with profile', async ({ client }) => {
  const response = client.post('/register').json({
    firstName: 'Ahmed',
    lastName: 'Mahmoud',
    email: 'qwikle@gmail.com',
    password: 'Aazaaz69',
    birthDay: '18/08/1988',
    emailConfirmation: 'qwikle@gmail.com',
    passwordConfirmation: 'Aazaaz69',
  })
  ;(await response).assertAgainstApiSpec()
})

test('login with credentials', async ({ client }) => {
  const response = client.post('/login').json({
    email: 'qwikle@gmail.com',
    password: 'Aazaaz69',
  })
  ;(await response).assertAgainstApiSpec()
})

test('delete account', async ({client}) => {
  const user = await UserFactory.with('profile', 1).create()
  const response = client.delete('/user').json({
    deleteConfirmation: true
  }).loginAs(user)
  await (await response).assertAgainstApiSpec()
})