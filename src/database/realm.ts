import Realm from 'realm';
import {ObjectId} from 'bson';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

export type RecordType = {
  _id: ObjectId;
  create_time: Date;
  name: string;
  type: number;
  private: boolean;
  description?: string;
  items?: Array<RecordItemsType>;
};

export class Record {
  static schema = {
    name: 'Record',
    primaryKey: '_id',
    properties: {
      _id: {
        type: 'objectId',
      },
      create_time: {
        type: 'date',
      },
      name: 'string',
      type: 'int',
      private: {
        type: 'bool',
        default: false,
      },
      description: 'string',
      items: 'RecordItems[]',
    },
  };
  public data: RecordType;
  constructor(
    name: string,
    type: number,
    isPrivate?: boolean,
    description?: string,
  ) {
    this.data = {
      _id: new ObjectId(),
      create_time: new Date(),
      name: name,
      type: type,
      private: isPrivate === true,
      description: description,
      items: [],
    };
  }
}

export type RecordItemsType = {
  _id: ObjectId;
  owner?: RecordType;
  create_time: Date;
  value: number;
};

export class RecordItems {
  static schema = {
    name: 'RecordItems',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      owner: {
        type: 'linkingObjects',
        objectType: 'Record',
        property: 'items',
      },
      create_time: 'date',
      value: 'double',
    },
  };
  public data: RecordItemsType;
  constructor(value: number, owner?: RecordType) {
    this.data = {
      _id: new ObjectId(),
      create_time: new Date(),
      value: value,
      owner: owner,
    };
  }
}

export const Schema = [Record, RecordItems];

/**
 * SchemaVersion 3: add private and description properties to Record Schema
 */
export const SchemaVersion = 3;

export const databaseStoragePath = Realm.defaultPath;
console.log('Realm.defaultPath is', Realm.defaultPath);
console.log('databaseStoragePath is', databaseStoragePath);
