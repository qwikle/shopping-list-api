import { test } from '@japa/runner'

test('login with email and passsword credentials', async ({ client }) => {
    const response = client.post('/auth/login')

    console.log(response.)
})
