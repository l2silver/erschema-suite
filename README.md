# erschema-suite

A smart immutablejs library for managing and accessing the redux-store

### Basic Concepts

Redux applications all have a few key components. Reducers to change the store's state, actions to trigger the reducer, and selectors to pull data from the store.
Most applications will write a custom function for each case in a reducer function, which generally require custom actions to trigger the reducer, and custom selectors to retreive the data.
Erschema-suite uses standard RESTful reducers and actions, which also results in a standardized store state that is easy to select data from.

### Redux Store

The erschema provides a reducer function that stores data in two basic places: Entities, and Relationships.

```
import {Record, Map} from 'immutable'
// Example redux store with erschema
{
  other store properties...,
  erschema: {
    entities: Map<{
      users: Record<{
        data: Map<{
          id: UserRecord<{id, name}>
        }>
      }>
    }>,
    relationships: Map<{
      users: Map<{
        friends: Map<{
          [userId]: OrderedList<friendId> (For one to many relationships) || friendId (for one to one relationships)
        }>
      }>
    }>
  }
}
```

### Actions

The standardize erschema actions for relationships are:

* index
* link
* unlink
* createRelationship
* concatRelationship
* reorder

The standardized erschema actions for entities are:

* create
* update
* remove
* get
* index
* getRelated
* getAdditionalEntityProperties
