import React from 'react';
import {ListRenderItemInfo, StyleSheet, Text, View} from 'react-native';
import {RecordType} from '../database/realm';
import {ListItem} from 'react-native-elements';

export type Props = ListRenderItemInfo<RecordType>;

const PercentageRecord: React.FC<Props> = ({item, index}: Props) => {
  return (
    <ListItem containerStyle={styles.renderItem} bottomDivider>
      <View style={styles.indexContainer}>
        <Text style={styles.indexText}>{index + 1}</Text>
      </View>
      <Text>{item.name}</Text>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  renderItem: {},
  indexContainer: {},
  indexText: {},
});

export default PercentageRecord;
