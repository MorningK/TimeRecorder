import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {StyleSheet, Text, View, FlatList, TextInput} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import logger from '../log';
import {useDatabase, useRecord, useRecordItems} from '../hooks';
import {
  Record,
  RecordItems,
  RecordItemsType,
  RecordType,
} from '../database/realm';
import {ObjectId} from 'bson';
import Realm from 'realm';
import moment from 'moment';
import {CheckBox, Icon, Input, ListItem} from 'react-native-elements';
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
import {
  HeaderButtons,
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';
import CommonStyles from '../common/CommonStyles';
import BottomDeleteSheet from '../components/BottomDeleteSheet';
import RecordTitle from '../containers/RecordTitle';
import ValueRanger from '../components/ValueRanger';
import TimeSelection from '../components/TimeSelection';

export type Props = {
  route: RouteProp<{params: {recordId: string}}, 'params'>;
};
const MaterialHeaderButton = (props: any) => (
  <HeaderButton {...props} IconComponent={Icon} iconSize={23} color="black" />
);

const RecordItemList: React.FC<Props> = ({route}: Props) => {
  const recordId = route.params.recordId;
  logger.log('recordId', recordId);
  const database = useDatabase();
  const navigation = useNavigation();
  const [selection, setSelection] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState(new Set<string>());
  const [rangeValue, setRangeValue] = useState([] as number[]);
  const [timeRange, setTimeRange] = useState(new Date());
  const record = useRecord(database, recordId);
  const list = useRecordItems(record, rangeValue, timeRange);
  const gotoRecordChart = () => {
    navigation.navigate('RecordChart', {
      recordId: record?._id.toHexString(),
      values: rangeValue,
      times: timeRange.getTime(),
    });
  };
  const onRecordSelection = (itemId: string) => {
    if (!selection) {
      return;
    }
    if (selectedRecords.size === 0) {
      onSelectionChange(true);
      setSelectedRecords(state => {
        const result = new Set<string>(state);
        result.add(itemId);
        return result;
      });
    } else if (selectedRecords.has(itemId)) {
      setSelectedRecords(state => {
        const result = new Set<string>(state);
        result.delete(itemId);
        return result;
      });
    } else {
      setSelectedRecords(state => {
        const result = new Set<string>(state);
        result.add(itemId);
        return result;
      });
    }
  };
  const onSelectionChange = useCallback(
    (value: boolean, itemId?: string) => {
      setSelection(value);
      if (value && selectedRecords.size === 0 && itemId) {
        setSelectedRecords(state => {
          const result = new Set<string>(state);
          result.add(itemId);
          return result;
        });
      }
      if (!value) {
        setSelectedRecords(new Set<string>());
      }
    },
    [selectedRecords.size],
  );
  useEffect(() => {
    const onLeftPress = () => {
      if (selection) {
        onSelectionChange(false);
      } else {
        navigation.goBack();
      }
    };
    const onRightPress = () => {
      if (record?.items && record.items.length > 0) {
        const result = new Set<string>();
        if (selectedRecords.size < record.items.length) {
          for (let i = 0; i < record.items.length; i++) {
            result.add(record.items[i]._id.toHexString());
          }
        }
        setSelectedRecords(result);
      }
    };
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButtons left HeaderButtonComponent={MaterialHeaderButton}>
          <Item
            title="取消"
            iconName={selection ? undefined : 'arrow-back'}
            onPress={onLeftPress}
          />
        </HeaderButtons>
      ),
      headerRight: () =>
        selection ? (
          <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
            <Item
              title={
                selectedRecords.size === record?.items?.length
                  ? '取消全选'
                  : '全选'
              }
              onPress={onRightPress}
            />
          </HeaderButtons>
        ) : null,
    });
  }, [
    navigation,
    onSelectionChange,
    record?.items,
    selectedRecords.size,
    selection,
  ]);
  const onSubmit = async (name: string) => {
    console.log('new name is', name);
    if (name === record?.name) {
      return false;
    }
    if (name.length === 0) {
      Toast.show('请输入新的记录名称');
      return true;
    }
    if (record) {
      return new Promise<boolean>((resolve, reject) => {
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
            console.log('update name', value);
            Toast.show('更新成功');
            resolve(false);
          })
          .catch(e => {
            Toast.show('更新失败');
            reject(e);
          });
      });
    } else {
      Toast.show('更新失败');
      return true;
    }
  };
  const onDelete = async () => {
    console.log('onDelete', selectedRecords);
    if (record) {
      await updateObject<RecordType>(
        database,
        Record.schema.name,
        record._id,
        origin => {
          if (origin.items) {
            origin.items = origin.items?.filter(val => {
              return !selectedRecords.has(val._id.toHexString());
            });
          }
          return origin;
        },
      );
    }
    onSelectionChange(false);
  };
  const onValueSearch = (value: number | number[]) => {
    console.log('onValueSearch', value);
    if (typeof value === 'number') {
      setRangeValue([value]);
    } else {
      setRangeValue(value);
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
      valueComponent =
        item.value === 1 ? (
          <Icon name={'thumb-up-alt'} />
        ) : (
          <Icon name={'thumb-down-alt'} />
        );
    }
    return (
      <View style={styles.recordItemContainer}>
        <ListItem
          bottomDivider
          containerStyle={styles.listItemContainer}
          onPress={() => onRecordSelection(item._id.toHexString())}
          onLongPress={() => onSelectionChange(true, item._id.toHexString())}>
          <View>
            <View style={styles.recordItemContentContainer}>
              <View style={styles.recordIndexContainer}>
                <Text
                  style={[
                    styles.recordIndexText,
                    selection
                      ? CommonStyles.displayNone
                      : CommonStyles.displayFlex,
                  ]}>
                  {index + 1}
                </Text>
                <CheckBox
                  containerStyle={[
                    selection
                      ? CommonStyles.displayFlex
                      : CommonStyles.displayNone,
                    styles.selectionContainer,
                  ]}
                  checkedIcon={<Icon name="check-circle" color={'green'} />}
                  uncheckedIcon={<Icon name="check-circle-outline" />}
                  onPress={() => onRecordSelection(item._id.toHexString())}
                  checked={selectedRecords.has(item._id.toHexString())}
                />
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
      <RecordTitle
        onNameSubmit={onSubmit}
        record={record}
        onPressChart={gotoRecordChart}
      />
      <ValueRanger
        recordType={record?.type || -1}
        onValueChange={onValueSearch}
      />
      <TimeSelection />
      <FlatList
        style={styles.listContainer}
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item._id.toHexString()}
      />
      <BottomDeleteSheet
        visible={selection}
        onDelete={onDelete}
        onClose={() => onSelectionChange(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    width: '100%',
  },
  recordItemContainer: {},
  listItemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordItemContentContainer: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  recordIndexContainer: {
    width: 60,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
  },
  recordIndexText: {
    textAlign: 'left',
  },
  selectionContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    borderWidth: 0,
  },
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
