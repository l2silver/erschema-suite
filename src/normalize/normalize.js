// @flow
import blacklist from 'blacklist'
import {relationshipTypes, getRelationships} from 'erschema'
import pick from 'lodash.pick'
import type {$schemaWithRelationshipsArray, $entitySchemaWithRelationshipsArray} from 'erschema/types'

type $$id = string | number;
type $$mapOf<X> = {[key: string]: X};
type $$numberMapOf<X> = {[key: number]: X};
type $$idMapOf<X> = {[key: string | number]: X};

export type $normalizeResponse = {
  entities: $$mapOf<$$idMapOf<Object>>,
  relationships: $$mapOf<$$mapOf<$$idMapOf<$$id | $$id[]>>>
};

export default function normalize(
  input: Object,
  entityName: string,
  schema: $schemaWithRelationshipsArray,
  startingSchema?: $entitySchemaWithRelationshipsArray
) : $normalizeResponse {
  const entities = {}
  const relationships = {}
  _normalizeRecursive(input, entityName, schema, entities, relationships, startingSchema)
  return {entities, relationships}
}

const _normalizeRecursive = function (input, entityName: string, schema, entities, relationshipData, startingSchema) {
  const entitySchema = (startingSchema || schema[entityName])
  if (!entitySchema){
    throw Error(`schema ${entityName} not defined`)
  }
  const {modifier, relationships, idFunc, properties} = entitySchema
  const usedRelationships = []
  const inputId = idFunc(input)
  relationships.forEach(relationshipSchema => {
    const {variableRelationshipName, relationshipName, alias} = relationshipSchema
    const variableIds = {}
    const relation = input[alias || relationshipName]

    if (relation) {
      usedRelationships.push(relationshipName)
      const { idFunc: relationshipIdFunc } = schema[relationshipSchema.name];
      if (relationshipSchema.type === relationshipTypes.MANY) {
        let relationshipIds = []
        relation.forEach(relatedEntity => {
          if (typeof relatedEntity === 'number') {
            relationshipIds.push(relatedEntity)
          }
          else {
            _normalizeRecursive(relatedEntity, relationshipSchema.name, schema, entities, relationshipData)
            if (variableRelationshipName && variableRelationshipName.getRelationshipName) {
              const variableName = variableRelationshipName.getRelationshipName(relatedEntity)
              if (!variableIds[variableName]) {
                variableIds[variableName] = []
              }
              variableIds[variableName].push(relationshipIdFunc(relatedEntity))
            }
            relationshipIds.push(relationshipIdFunc(relatedEntity))
          }
        })
        if (variableRelationshipName && variableRelationshipName.getRelationshipName) {
          Object.keys(variableIds).forEach(variableRelationshipName => {
            _addToRelationships(relationshipData, entityName, variableRelationshipName, inputId, variableIds[variableRelationshipName])
          })
        }
        _addToRelationships(relationshipData, entityName, relationshipName, inputId, relationshipIds)
      }
      else {
        let relationshipId
        if (typeof relation === 'number') {
          relationshipId = relation
        }
        else {
          relationshipId = relationshipIdFunc(relation)
          _normalizeRecursive(relation, relationshipSchema.name, schema, entities, relationshipData)
        }
        _addToRelationships(relationshipData, entityName, relationshipName, inputId, relationshipId)
      }
    }
  })
  _addToEntities(entities, entityName, usedRelationships, input, modifier, properties, inputId)
}

const _addToRelationships = function (relationships, entityName, relationshipName, entityId, values) {
  if (!relationships[entityName]) {
    relationships[entityName] = {}
  }
  if (!relationships[entityName][relationshipName]) {
    relationships[entityName][relationshipName] = {}
  }
  relationships[entityName][relationshipName][entityId] = values
}

const _addToEntities = function (entities, entityName, usedRelationships, entity, modifier, properties, id) {
  if (!entities[entityName]) {
    entities[entityName] = {}
  }

  let nextEntity = pick(entity, properties)
  // if (usedRelationships.length) {
  //   nextEntity = blacklist.apply(null, [entity,...usedRelationships])
  // }
  const nextEntityWithId = { ...nextEntity, id};
  entities[entityName][id] = modifier ? modifier(nextEntityWithId) : nextEntityWithId
}
