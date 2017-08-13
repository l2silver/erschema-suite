// @flow
import {Map} from 'immutable'
import {handleActions} from 'redux-actions'
import actionNames from 'resource-action-types'
import {relationshipTypes, getRelationships} from 'erschema'
import handlers from './handlers'
import generateDefaultState from '../generateDefaultState'
import type {$relationshipSchema, $relationshipsSchema} from 'erschema/types'
const {ONE, MANY} = relationshipTypes


type $coreProps = {
  name: string,
  defaultStateConfig?: Object,
	options?: Object,
  otherActions?: Object,
  locationPath?: string[],
};

type $props = $coreProps & {
  relationshipsSchema: $relationshipsSchema
};

type $pageProps = $coreProps & {
  relationshipsSchema: {[key: string]: $relationshipsSchema}
};

function getMapOfRelationshipDefaultValues(relationships, startValue = {}){
  return relationships.reduce((finalResult, {relationshipName}) => {
    finalResult[relationshipName] = new Map({})
    return finalResult
  }, startValue)
}

function getMapOfRelationshipTypes(relationships){
  return relationships.reduce((finalResult, {relationshipName, type})=>{
    finalResult[relationshipName] = type
    return finalResult
  }, {})
}

function getMapOfRelationships(relationships, startValue = {}, page){
  return relationships.reduce((finalResult: Object, {name, relationshipName})=>{
    if(!finalResult[name]){
      finalResult[name] = []
    }
    finalResult[name].push(page ? [relationshipName, page] : [relationshipName])
    return finalResult
  }, startValue)
}

export default function ({name, relationshipsSchema, defaultStateConfig = {}, otherActions = {}}: $props) {
  const relationships = getRelationships(relationshipsSchema)
  const mapOfRelationshipDefaultValues = getMapOfRelationshipDefaultValues(relationships)
  const mapOfRelationshipTypes = getMapOfRelationshipTypes(relationships)
  const mapOfRelationships = getMapOfRelationships(relationships)
  const removeActions = Object.keys(mapOfRelationships).reduce((finalResult, relatedEntityName)=>{
    finalResult[actionNames.remove(relatedEntityName)] = handlers.remove(mapOfRelationshipTypes, mapOfRelationships[relatedEntityName])
    return finalResult
  }, {})
  return handleActions(
    {
      [actionNames.link(name)]: handlers.link(mapOfRelationshipTypes),
      [actionNames.unlink(name)]: handlers.unlink(mapOfRelationshipTypes),
      [actionNames.createRelationship(name)]: handlers.createRelationship(mapOfRelationshipTypes),
      [actionNames.concatRelationship(name)]: handlers.concatRelationship(mapOfRelationshipTypes),
      [actionNames.indexRelationship(name)]: handlers.indexRelationship(mapOfRelationshipTypes),
      [actionNames.reorder(name)]: handlers.reorder(mapOfRelationshipTypes),
      ...removeActions,
      ...otherActions
    },
    generateDefaultState({...mapOfRelationshipDefaultValues, ...defaultStateConfig}))
}

export function relationshipPageReducer({name, relationshipsSchema, defaultStateConfig = {}, otherActions = {}}: $pageProps) {
  const relationships = Object.keys(relationshipsSchema).reduce((finalResult, page)=>{
    finalResult[page] = getRelationships(relationshipsSchema[page])
    return finalResult
  }, {})
  const mapOfRelationshipDefaultValues = Object.keys(relationships).reduce((finalResult, page)=>{
    return getMapOfRelationshipDefaultValues(relationships[page], finalResult)
  }, {})
  
  const mapOfRelationshipTypes = Object.keys(relationships).reduce((finalResult, page)=>{
    finalResult[page] = getMapOfRelationshipTypes(relationships[page])
    return finalResult
  }, {})
  const mapOfRelationships = Object.keys(relationships).reduce((finalResult, page)=>{
    return getMapOfRelationships(relationships[page], finalResult, page)
  }, {})
  const removeActions = Object.keys(mapOfRelationships).reduce((finalResult, relatedEntityName)=>{
    finalResult[actionNames.remove(relatedEntityName)] = handlers.remove({}, mapOfRelationships[relatedEntityName], mapOfRelationshipTypes)
    return finalResult
  }, {})
  return handleActions(
    {
      [actionNames.link(name)]: handlers.link({}, mapOfRelationshipTypes),
      [actionNames.unlink(name)]: handlers.unlink({}, mapOfRelationshipTypes),
      [actionNames.createRelationship(name)]: handlers.createRelationship({}, mapOfRelationshipTypes),
      [actionNames.concatRelationship(name)]: handlers.concatRelationship({}, mapOfRelationshipTypes),
      [actionNames.indexRelationship(name)]: handlers.indexRelationship({}, mapOfRelationshipTypes),
      ...removeActions,
      ...otherActions
    },
    generateDefaultState({...mapOfRelationshipDefaultValues, ...defaultStateConfig}))
}