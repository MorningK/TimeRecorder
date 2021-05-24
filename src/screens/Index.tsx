import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/core';

export type Props = Record<string, never>;

const Index: React.FC<Props> = ({}) => {
  const navigation = useNavigation();
  const gotoRecordList = () => {
    navigation.navigate('RecordList');
  };
  const gotoAddRecord = () => {
    navigation.navigate('AddRecord');
  };
  return (
    <View style={styles.container}>
      <StatusBar
        hidden={false}
        translucent={true}
        barStyle="light-content"
        backgroundColor="transparent"
      />
      <Text>TimeRecorder</Text>
      <Button title="新增记录" onPress={gotoAddRecord} />
      <Button title="查看记录" onPress={gotoRecordList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default Index;
