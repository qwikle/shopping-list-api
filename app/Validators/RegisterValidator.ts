import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    first_name: schema.string({}, [
      rules.alpha({ allow: ['dash'] }),
      rules.maxLength(50),
      rules.minLength(3),
    ]),
    last_name: schema.string({}, [
      rules.alpha({ allow: ['dash'] }),
      rules.maxLength(50),
      rules.minLength(3),
    ]),
    birth_day: schema.date({ format: 'dd/mm/yyyy' }),
    email: schema.string({}, [
      rules.email(),
      rules.confirmed(),
      rules.unique({ column: 'email', table: 'users' }),
      rules.trim(),
    ]),
    password: schema.string({}, [
      rules.regex(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$')),
      rules.confirmed(),
    ]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {}
}
