import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, CheckBox, Input} from 'react-native-elements';
import {RecordeTypes} from '../common/constant';
import {useNavigation} from '@react-navigation/core';
import logger from '../log';
import {useDatabase} from '../hooks';
import {createObject} from '../database/database';
import {Record} from '../database/realm';

export type Props = {};

const AddRecord: React.FC<Props> = ({}) => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [type, setType] = useState(0);
  const [loading, setLoading] = useState(false);
  const database = useDatabase();
  const onSave = async () => {
    setLoading(true);
    logger.log('save record', name, type);
    await createObject(
      database,
      Record.schema.name,
      new Record(name, type).data,
    );
    setLoading(false);
  };
  const onCancel = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <Input
        label="记录名称"
        labelStyle={styles.inputLabel}
        placeholder="请输入记录名称"
        onChangeText={value => setName(value)}
      />
      <View style={styles.recordTypes}>
        <Text style={[styles.inputLabel, styles.recordLabel]}>记录类型</Text>
        {RecordeTypes.map(recordType => (
          <View key={recordType.value}>
            <CheckBox
              checkedIcon="circle"
              uncheckedIcon="circle"
              title={recordType.name}
              checked={type === recordType.value}
              onPress={() => setType(recordType.value)}
            />
          </View>
        ))}
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
    alignItems: 'center',
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
});

export default AddRecord;
