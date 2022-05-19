import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductList extends BaseSchema {
  protected tableName = 'product_lists'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.uuid('owner').references('id').inTable('users').notNullable().onDelete('CASCADE')
      table.string('name', 100).nullable()
      table.string('visibility').checkBetween(['family, owner']).notNullable().defaultTo('owner')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
