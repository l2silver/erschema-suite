/// @flow
import getRelationships from './getRelationships'
import type {$schema, $schemaWithRelationshipsArray} from './types'
export default function getSchemaWithRelationshipsArray(schema: $schema) : $schemaWithRelationshipsArray{
  return Object.keys(schema).reduce((finalResult, entityName)=>{
    finalResult[entityName] = {...schema[entityName], relationships: getRelationships(schema[entityName].relationships)}
    return finalResult
  }, {})
}