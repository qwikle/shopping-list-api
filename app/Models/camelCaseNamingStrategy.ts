import { string } from '@ioc:Adonis/Core/Helpers'
import { SnakeCaseNamingStrategy, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {

  public serializedName(_model: typeof BaseModel, propertyName: string) {
    return string.camelCase(propertyName)
  }

  public relationForeignKey(
    relation: string,
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    if (relation === 'belongsTo') {
      return string.camelCase(`${relatedModel.name}_${relatedModel.primaryKey}`)
    }

    return string.camelCase(`${model.name}_${model.primaryKey}`)
  }

  public relationPivotTable(
    _relation: 'manyToMany',
    model: typeof BaseModel,
    relatedModel: typeof BaseModel
  ) {
    return string.snakeCase(
      [relatedModel.name, model.name]
        .sort()
        .join('_')
    )
  }

  public relationPivotForeignKey(
    _relation: 'manyToMany',
    model: typeof BaseModel
  ) {
    return string.snakeCase(`${model.name}_${model.primaryKey}`)
  }
  
  public paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'perPage',
      currentPage: 'currentPage',
      lastPage: 'lastPage',
      firstPage: 'firstPage',
      firstPageUrl: 'firstPageUrl',
      lastPageUrl: 'lastPageUrl',
      nextPageUrl: 'nextPageUrl',
      previousPageUrl: 'previousPageUrl',
    }
  }
}
