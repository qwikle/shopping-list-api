import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'


test('retrieve user informations', async ({client}) => {
  const user = await UserFactory.with('profile', 1).create()
  const response = client.get('/user/').loginAs(user)
  console.log((await response).body())
  await (await response).assertAgainstApiSpec()
})


// test('update email address', async ({ client }) => {
//   const user = await UserFactory.with('profile', 1).create()
//   const response = client
//     .patch('/user/update-email')
//     .json({
//       email: 'aler@gmail.com',
//       emailConfirmation: 'aler@gmail.com',
//     })
//     .loginAs(user)
//   ;(await response).assertAgainstApiSpec()
// })
