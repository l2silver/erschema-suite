// @flow
import normalize from './normalize'
import {standardizeEntity, getSchemaWithRelationshipsArray} from 'erschema'
import Chance from 'chance'

const chance = new Chance()
describe('reducerUtils', function () {
  describe('normalize', function () {
    let input, schema, relationshipSchema, comment
    beforeEach(function () {
      comment = {
        id: chance.natural(),
        content: chance.sentence()
      }
      input = {
        id: 1,
        title: chance.word(),
        comments: [
          comment
        ]
      }
      
      schema = getSchemaWithRelationshipsArray({
        articles: standardizeEntity({
          Model: class {},
          properties: ['id', 'title'],
          relationships: {
            manyRelationships: {
              comments: [{}]
            },
            monoRelationships: {

            }
          }
        }),
        comments: standardizeEntity({
          Model: class {},
          properties: ['id', 'content'], 
        })
      })
    })
    it('returns entities and relationships based on the input', function () {
      const {entities, relationships} = normalize(input, 'articles', schema)
      expect(entities).toEqual({
        articles: {
          [input.id]: {
            id: input.id,
            title: input.title,
          }
        },
        comments: {
          [comment.id]: comment
        }
      })
      expect(relationships).toEqual({
        articles: {
          comments: {
            [input.id]: [comment.id]
          }
        }
      })
    })
  })
})
