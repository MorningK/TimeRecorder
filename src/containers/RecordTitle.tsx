import React, {createRef, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon, Input} from 'react-native-elements';
import moment from 'moment';
import {RecordType} from '../database/realm';

export type RecordTitleProps = {
  record: RecordType | undefined;
  onNameSubmit: (name: string) => Promise<boolean>;
  onPressChart: () => void;
};

const RecordTitle: React.FC<RecordTitleProps> = ({
  record,
  onNameSubmit,
  onPressChart,
}: RecordTitleProps) => {
  const [editable, setEditable] = useState(false);
  const inputRef = createRef<TextInput>();
  const [name, setName] = useState('');
  useEffect(() => {
    record && setName(record.name);
  }, [record]);
  const editRecordName = () => {
    setEditable(state => !state);
  };
  const onValueChange = (value: string) => {
    setName(value);
  };
  const onSubmit = async () => {
    const result = await onNameSubmit(name);
    setEditable(result);
  };
  return (
    <View style={styles.topContainer}>
      <View style={styles.displayContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>记录名称：</Text>
          {!editable && (
            <View style={styles.editNameContainer}>
              <Text style={styles.nameText}>{record && record.name}</Text>
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
          onPress={onPressChart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default RecordTitle;
