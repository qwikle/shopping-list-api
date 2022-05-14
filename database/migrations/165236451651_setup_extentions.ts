import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SetupExtentions extends BaseSchema {
  protected tableName = 'setup_extentions'

  public async up () {

    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  }

  public async down () {
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')
  }
}