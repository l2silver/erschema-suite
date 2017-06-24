// @flow
import {ONE, MANY} from './relationshipTypes'
import type {$relationshipsSchema, $relationshipSchema} from './types'

function getRelationshipArray(relationshipType: number, relationshipSchema: {[key: string]: $relationshipSchema[]}, initialValue=[]){
  const results = Object.keys(relationshipSchema).reduce((finalResult, relationshipName)=>{
    return relationshipSchema[relationshipName].reduce((finalFinalResult, relationshipSchema)=>{
      finalFinalResult.push({
      	...relationshipSchema,
      	name: relationshipSchema.name || relationshipName,
      	alias: relationshipSchema.alias || relationshipName,
      	relationshipName: relationshipName,
      	type: relationshipType
      })
      return finalFinalResult
    }, finalResult)
  }, initialValue)
  return results
}

export default function(relationshipsSchema: $relationshipsSchema){
  const monoRelationships = getRelationshipArray(ONE, relationshipsSchema.monoRelationships, [])
  return getRelationshipArray(MANY, relationshipsSchema.manyRelationships, monoRelationships)
}
