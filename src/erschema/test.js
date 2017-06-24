// @flow
import standardizeRelationships from './standardizeRelationships'

const standardRelationships = standardizeRelationships({monoRelationships: {}, manyRelationships: {friends: [{}]}})
// $FlowFixMe
const x : number = standardRelationships.manyRelationships.friends[1].type
// $FlowFixMe
const y : number = standardRelationships.manyRelationships.friendsz[1].type