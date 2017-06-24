// @flow
import standardizeRelationships from './standardizeRelationships'
import type {$standardizeRelationships} from './standardizeRelationships'
import type {$entitySchema, $relationshipsSchema} from './types'
export type $standardizeEntity = {
  properties: string[] | Object,
  Model: Class<any>,
  id?: string,
  idFunc?: (ent: Object)=>string,
  modifier?: (ent: Object)=>Object,
  relationships?: $relationshipsSchema
};

export default function standardizeEntity (
  {
    id,
    idFunc,
    properties,
    modifier = (ent)=>ent,
    Model,
    relationships = {monoRelationships: {}, manyRelationships: {}},
    ...otherProps
  }: $standardizeEntity) : $entitySchema {
  const standardIdFunc = (ent) => (ent[id || 'id'])
  return {
    idFunc: idFunc || standardIdFunc,
    properties: Array.isArray(properties) ? properties : Object.keys(properties),
    modifier,
    Model,
    // relationships: standardizeRelationships(relationships), 
    relationships,
    ...otherProps
  }
}
