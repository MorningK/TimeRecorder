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
import logger from '../log';
import {FAB, Icon, ListItem} from 'react-native-elements';
import {EmptyObject} from '../common/constant';
import AbstractRecord from '../components/AbstractRecord';

export type Props = EmptyObject;

const EmptyElement = () => {
  return <Text>添加记录项</Text>;
};

const RecordList: React.FC<Props> = ({}) => {
  const navigation = useNavigation();
  const [list, setList] = useState([] as ResultType);
  const database = useDatabase();
  useEffect(() => {
    if (database != null) {
      const records = database.objects(Record.schema.name);
      logger.log('get records', records);
      setList(records);
    }
  }, [database]);
  const gotoAddRecord = () => {
    navigation.navigate('AddRecord');
  }
  const renderItem = (props: ListRenderItemInfo<RecordType>) => {
    return (
      <View style={styles.renderItem}>
        <AbstractRecord
          renderProps={props}
          OperationComponent={EmptyElement()}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item._id.toHexString()}
      />
      <FAB
        containerStyle={styles.addContainer}
        buttonStyle={styles.addBtn}
        iconContainerStyle={styles.addIcon}
        placement="right"
        visible={true}
        icon={<Icon name="add" />}
        raised={true}
        onPress={gotoAddRecord}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  renderItem: {
    width: '100%',
  },
  addContainer: {},
  addBtn: {
    borderRadius: 28,
    width: 56,
    height: 56,
    overflow: 'hidden',
  },
  addIcon: {},
});

export default RecordList;
