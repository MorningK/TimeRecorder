import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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
  const [editable, setEditable] = useState(false);
  const [name, setName] = useState('');
  const [selection, setSelection] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState(new Set<string>());
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
  const onRecordSelection = (itemId: string) => {
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
  const onSelectionChange = (value: boolean, itemId?: string) => {
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
  };
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
  }, [navigation, record?.items, selection]);
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
  const onDelete = async () => {
    console.log('onDelete', selectedRecords);
    if (record) {
      await updateObject<RecordType>(
        database,
        Record.schema.name,
        record._id,
        origin => {
          if (origin.items) {
            const items = origin.items?.filter(val => {
              return !selectedRecords.has(val._id.toHexString());
            });
            origin.items = items;
          }
          return origin;
        },
      );
    }
    onSelectionChange(false);
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
          onLongPress={() => onSelectionChange(true, item._id.toHexString())}>
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
          <View>
            <View
              style={[
                selection ? CommonStyles.displayFlex : CommonStyles.displayNone,
              ]}>
              <CheckBox
                checkedIcon={<Icon name="check-circle" color={'green'} />}
                uncheckedIcon={<Icon name="check-circle-outline" />}
                checked={selectedRecords.has(item._id.toHexString())}
                onPress={() => onRecordSelection(item._id.toHexString())}
              />
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
