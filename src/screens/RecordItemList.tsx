import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import logger from '../log';
import {useDatabase, useRecord} from '../hooks';
import {Record, RecordItemsType, RecordType} from '../database/realm';
import {ObjectId} from 'bson';
import Realm from 'realm';
import moment from 'moment';
import {Icon, ListItem} from 'react-native-elements';
import {RATING_RECORD_TYPE} from '../common/constant';
import RatingRecordOperation from '../components/RatingRecordOperation';
import {useFocusEffect, useNavigation} from '@react-navigation/core';

export type Props = {
  route: RouteProp<{params: {recordId: string}}, 'params'>;
};

const RecordItemList: React.FC<Props> = ({route}: Props) => {
  const recordId = route.params.recordId;
  logger.log('recordId', recordId);
  const database = useDatabase();
  const navigation = useNavigation();
  const record = useRecord(database, recordId);
  const gotoRecordChart = () => {
    navigation.navigate('RecordChart', {recordId: record?._id.toHexString()});
  };
  const renderItem = (props: {item: RecordItemsType; index: number}) => {
    const {item, index} = props;
    let valueComponent = (
      <Text style={styles.recordValueText}>{item.value}</Text>
    );
    if (record?.type === RATING_RECORD_TYPE.value) {
      valueComponent = (
        <RatingRecordOperation
          readonly={true}
          value={item.value}
          showRating={false}
          imageSize={25}
        />
      );
    }
    return (
      <View style={styles.recordItemContainer}>
        <ListItem bottomDivider containerStyle={styles.listItemContainer}>
          <View>
            <View style={styles.recordItemContentContainer}>
              <View style={styles.recordIndexContainer}>
                <Text style={styles.recordIndexText}>{index + 1}</Text>
              </View>
              <View style={styles.recordValueContainer}>{valueComponent}</View>
            </View>
            <View style={styles.recordItemCreateTimeContainer}>
              <Text style={styles.recordCreateTimeText}>
                {moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </View>
          </View>
        </ListItem>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              记录名称：{record != null && record.name}
            </Text>
          </View>
          <View style={styles.createTimeContainer}>
            <Text style={styles.createTimeText}>
              创建时间：
              {record != null &&
                moment(record.create_time).format('YYYY-MM-DD HH:mm:ss')}
            </Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name="insights"
            type="material"
            size={32}
            onPress={gotoRecordChart}
          />
        </View>
      </View>
      <FlatList
        style={styles.listContainer}
        data={record?.items}
        renderItem={renderItem}
        keyExtractor={item => item._id.toHexString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    width: '100%',
  },
  nameText: {},
  createTimeContainer: {
    width: '100%',
  },
  createTimeText: {},
  listContainer: {
    width: '100%',
  },
  recordItemContainer: {},
  listItemContainer: {},
  recordItemContentContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  recordIndexContainer: {
    width: 50,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  recordIndexText: {},
  recordValueContainer: {
    // flex: 1,
  },
  recordValueText: {},
  recordItemCreateTimeContainer: {
    marginTop: 12,
  },
  recordCreateTimeText: {
    fontSize: 12,
  },
});

export default RecordItemList;
