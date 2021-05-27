import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, CheckBox, Icon, Input} from 'react-native-elements';
import {EmptyObject, RecordeTypes} from '../common/constant';
import {useNavigation} from '@react-navigation/core';
import logger from '../log';
import {useDatabase} from '../hooks';
import {createObject} from '../database/database';
import {Record} from '../database/realm';
import Toast from 'react-native-simple-toast';

export type Props = EmptyObject;

const AddRecord: React.FC<Props> = ({}) => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [type, setType] = useState(0);
  const [loading, setLoading] = useState(false);
  const database = useDatabase();
  const onNameChange = (value: string) => {
    setName(value);
    setNameError(false);
  };
  const onTypeChange = (value: number) => {
    setType(value);
    setTypeError(false);
  };
  const onSave = async () => {
    let valid = true;
    if (name === '') {
      setNameError(true);
      valid = false;
    }
    if (type === 0) {
      setTypeError(true);
      valid = false;
    }
    if (!valid) {
      return;
    }
    setLoading(true);
    try {
      logger.log('save record', name, type);
      await createObject(
        database,
        Record.schema.name,
        new Record(name, type).data,
      );
      Toast.show('创建成功');
      navigation.navigate('RecordList');
    } finally {
      setLoading(false);
    }
  };
  const onCancel = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Input
          label="记录名称"
          labelStyle={styles.inputLabel}
          placeholder="请输入记录名称"
          errorMessage={nameError ? '请输入记录名称' : undefined}
          errorStyle={styles.errorMsg}
          onChangeText={onNameChange}
        />
        <View style={styles.recordTypes}>
          <Text style={[styles.inputLabel, styles.recordLabel]}>记录类型</Text>
          {RecordeTypes.map(recordType => (
            <View key={recordType.value}>
              <CheckBox
                checkedIcon={<Icon name="radio-button-checked" />}
                uncheckedIcon={<Icon name="radio-button-unchecked" />}
                title={recordType.name}
                checked={type === recordType.value}
                onPress={() => onTypeChange(recordType.value)}
              />
            </View>
          ))}
          {typeError && (
            <Text style={[styles.errorMsg, styles.typeErrorMsg]}>
              请选择记录类型
            </Text>
          )}
        </View>
      </View>
      <View style={styles.operations}>
        <Button title="保存" loading={loading} onPress={onSave} />
        <Button title="取消" onPress={onCancel} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
  },
  recordTypes: {
    width: '100%',
    flexDirection: 'column',
  },
  inputLabel: {},
  recordLabel: {},
  operations: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'center',
  },
  errorMsg: {},
  typeErrorMsg: {},
});

export default AddRecord;
