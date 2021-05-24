import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDatabase} from '../hooks';
import {Record, RecordType} from '../database/realm';
import Realm from 'realm';
import {useNavigation} from '@react-navigation/core';
import {ResultType} from '../database/database';

export type Props = {};

const RecordList: React.FC<Props> = ({}) => {
  const navigation = useNavigation();
  const [list, setList] = useState([] as ResultType);
  const database = useDatabase();
  useEffect(() => {
    if (database != null) {
      const records = database.objects(Record.schema.name);
      console.log(records);
      setList(records);
    }
  }, [database]);
  const renderItem = ({item}: ListRenderItemInfo<RecordType>) => {
    return (
      <View style={styles.renderItem}>
        <Text>{item.name}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Text>RecordList</Text>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item._id.toHexString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  renderItem: {},
});

export default RecordList;
