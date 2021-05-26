import Realm from 'realm';
import {ObjectId} from 'bson';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

export type RecordType = {
  _id: ObjectId;
  create_time: Date;
  name: string;
  type: number;
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
      items: 'RecordItems[]',
    },
  };
  public data: RecordType;
  constructor(name: string, type: number) {
    this.data = {
      _id: new ObjectId(),
      create_time: new Date(),
      name: name,
      type: type,
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
      value: 'int',
    },
  };
  public data: RecordItemsType;
  constructor(value: number) {
    this.data = {
      _id: new ObjectId(),
      create_time: new Date(),
      value: value,
    };
  }
}

export const Schema = [Record, RecordItems];

export const SchemaVersion = 1;

export const databaseStoragePath =
  Platform.OS === 'android' && Platform.Version >= 26
    ? Realm.defaultPath
    : RNFS.ExternalDirectoryPath + '/record.realm';
console.log('Realm.defaultPath is', Realm.defaultPath);
console.log('databaseStoragePath is', databaseStoragePath);
