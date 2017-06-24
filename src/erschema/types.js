// @flow
export type $relationshipSchema = {
    name?: string;
    alias?: string;
    relationshipName?: string;
    type?: number;
    variableRelationshipName?: {
      names: string[];
      getRelationshipName: Function;
    }
};

export type $relationshipSchema$ = {
    name: string;
    alias: string;
    relationshipName: string;
    type: number;
    variableRelationshipName?: {
      names: string[];
      getRelationshipName: Function;
    }
};
export type $relationshipsSchema = {
  monoRelationships: {[key: string]: $relationshipSchema[]};
  manyRelationships: {[key: string]: $relationshipSchema[]};
};

export type $entitySchema = {
  idFunc: Function;
  properties: string[];
  modifier: (ent: Object)=>Object;
  Model: Class<any>;
  relationships: $relationshipsSchema
};

export type $entitySchemaWithRelationshipsArray = {
  idFunc: Function;
  properties: string[];
  modifier: (ent: Object)=>Object;
  Model: Class<any>;
  relationships: $relationshipSchema$[];
};

export type $schema = {[key: string]: $entitySchema};
export type $schemaWithRelationshipsArray = {[key: string]: $entitySchemaWithRelationshipsArray}
