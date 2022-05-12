import { test } from '@japa/runner'

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
    console.log(await (await response).body())
    ;(await response).assertStatus(200)
  })


test('login with credentials', async ({ client }) => {
  const response = client.post('/auth/login').json({
    email: 'qwikle@gmail.com',
    password: 'Aazaaz69'
  })
  console.log((await response).body())
  ;(await response).assertStatus(200)
})