// @flow
import {ONE, MANY} from './relationshipTypes'
import type {$relationshipSchema} from './types'
type $mapOfRelationships<X> = $ObjMapi<X, <K>(k: K)=>Array<{
  name?: string,
  alias?: string,
  relationshipName?: string,
  type?: number,
  variableRelationshipName?: {
    names: string[],
    getRelationshipName: (ent: Object)=>string,
  }
}>>;

export type $standardizeRelationships<monoRelationships, manyRelationships> = {
  monoRelationships: $mapOfRelationships<monoRelationships>,
  manyRelationships: $mapOfRelationships<manyRelationships>,
};

type $relationship<X> = $ObjMapi<X, <K>(k: K)=>Array<$relationshipSchema>>;

export default function standardizeRelationships <monoRelationships, manyRelationships> (relationshipSchemas: $standardizeRelationships<monoRelationships, manyRelationships>){
  const result : {
    // $FlowFixMe
    monoRelationships: $relationship<monoRelationships>;
    // $FlowFixMe
    manyRelationships: $relationship<manyRelationships>;
  } = {
    // $FlowFixMe
    monoRelationships: standardizeRelationshipType(ONE, relationshipSchemas.monoRelationships),
    // $FlowFixMe
    manyRelationships: standardizeRelationshipType(MANY, relationshipSchemas.manyRelationships)
  }
  return result
}



function standardizeRelationshipType (relationshipType, relationship) {
  return Object.keys(relationship).reduce((finalResult, relationshipName)=>{
    finalResult[relationshipName] = relationship[relationshipName].map(({name, alias, type, variableRelationshipName, ...otherProps})=>{
      return {
        name: name || relationshipName,
        alias: alias || relationshipName,
        relationshipName,
        type: type || relationshipType,
        variableRelationshipName,
        ...otherProps
      }
    })    
    return finalResult
  }, {})
}

