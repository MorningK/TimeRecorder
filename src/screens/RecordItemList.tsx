import React, {createRef, useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, TextInput} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import logger from '../log';
import {useDatabase, useRecord} from '../hooks';
import {
  Record,
  RecordItems,
  RecordItemsType,
  RecordType,
} from '../database/realm';
import {ObjectId} from 'bson';
import Realm from 'realm';
import moment from 'moment';
import {Icon, Input, ListItem} from 'react-native-elements';
import {
  BOOLEAN_RECORD_TYPE,
  COUNTING_RECORD_TYPE,
  INPUTTING_RECORD_TYPE,
  RATING_RECORD_TYPE,
  TIMING_RECORD_TYPE,
} from '../common/constant';
import RatingRecordOperation from '../components/RatingRecordOperation';
import {useFocusEffect, useNavigation} from '@react-navigation/core';
import {defaultRecordOperationProps} from './RecordList';
import Toast from 'react-native-simple-toast';
import {updateObject} from '../database/database';
import {formatReadableTime} from '../common/tools';

export type Props = {
  route: RouteProp<{params: {recordId: string}}, 'params'>;
};

const RecordItemList: React.FC<Props> = ({route}: Props) => {
  const recordId = route.params.recordId;
  logger.log('recordId', recordId);
  const database = useDatabase();
  const navigation = useNavigation();
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState('');
  const inputRef = createRef<TextInput>();
  const record = useRecord(database, recordId);
  useEffect(() => {
    record && setName(record?.name);
  }, [record]);
  const gotoRecordChart = () => {
    navigation.navigate('RecordChart', {recordId: record?._id.toHexString()});
  };
  const editRecordName = () => {
    setEditable(state => !state);
  };
  const onValueChange = (value: string) => {
    setName(value);
  };
  const onSubmit = () => {
    console.log('new name is', name);
    if (name === record?.name) {
      setEditable(false);
      return;
    }
    if (name.length === 0) {
      Toast.show('请输入新的记录名称');
      return;
    }
    if (record) {
      updateObject<RecordType>(
        database,
        Record.schema.name,
        record._id,
        origin => {
          origin.name = name;
          return origin;
        },
      )
        .then(value => {
          setEditable(false);
          console.log('update name', value);
          Toast.show('更新成功');
        })
        .catch(e => {
          Toast.show('更新失败');
        });
    } else {
      Toast.show('更新失败');
    }
  };
  const renderItem = (props: {item: RecordItemsType; index: number}) => {
    const {item, index} = props;
    let valueComponent = (
      <Text style={styles.recordValueText}>{item.value}</Text>
    );
    if (record?.type === RATING_RECORD_TYPE.value) {
      valueComponent = (
        <RatingRecordOperation
          id={record._id.toHexString()}
          onComplete={defaultRecordOperationProps.onComplete}
          readonly={true}
          value={item.value}
          showRating={false}
          imageSize={25}
        />
      );
    } else if (record?.type === TIMING_RECORD_TYPE.value) {
      const value = formatReadableTime(item.value);
      valueComponent = <Text style={styles.recordValueText}>{value}</Text>;
    } else if (record?.type === COUNTING_RECORD_TYPE.value) {
      const value = `第${item.value}次记录`;
      valueComponent = <Text style={styles.recordValueText}>{value}</Text>;
    } else if (record?.type === INPUTTING_RECORD_TYPE.value) {
      const value = `记录值为：${item.value}`;
      valueComponent = <Text style={styles.recordValueText}>{value}</Text>;
    } else if (record?.type === BOOLEAN_RECORD_TYPE.value) {
      const value = item.value === 1 ? '是' : '否';
      valueComponent = <Text style={styles.recordValueText}>{value}</Text>;
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
        <View style={styles.displayContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>记录名称：</Text>
            {!editable && (
              <View style={styles.editNameContainer}>
                <Text style={styles.nameText}>
                  {record != null && record.name}
                </Text>
                <Icon
                  containerStyle={styles.editIcon}
                  name={'edit'}
                  size={24}
                  onPress={editRecordName}
                />
              </View>
            )}
          </View>
          {editable && (
            <View style={styles.inputContainer}>
              <Input
                ref={inputRef}
                placeholder={'请输入新的记录名称'}
                onChangeText={onValueChange}
                defaultValue={record?.name}
                rightIcon={<Icon name={'done'} onPress={onSubmit} />}
              />
            </View>
          )}
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
  displayContainer: {
    width: '80%',
  },
  iconContainer: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  editNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
  },
  editIcon: {
    paddingHorizontal: 12,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
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
