import React, {useState} from 'react';
import {ListRenderItemInfo, StyleSheet, Text, View} from 'react-native';
import {RecordType} from '../database/realm';
import {Icon, ListItem} from 'react-native-elements';
import CommonStyles from '../common/CommonStyles';
import {useNavigation} from '@react-navigation/core';

export type Props = {
  renderProps: ListRenderItemInfo<RecordType>;
  OperationComponent: React.FC | React.Component | Element;
};

const AbstractRecord: React.FC<Props> = (props: Props) => {
  const navigation = useNavigation();
  const {renderProps, OperationComponent} = props;
  const {item, index} = renderProps;
  const [showOperation, setShowOperation] = useState(false);
  const gotoRecordItemList = () => {
    navigation.navigate('RecordItemList', {recordId: item._id.toHexString()});
  };
  return (
    <ListItem containerStyle={styles.container} bottomDivider>
      <View style={styles.displayContainer}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <Text>{item.name}</Text>
        <View style={styles.operationIconContainer}>
          <View
            style={[
              showOperation
                ? CommonStyles.displayFlex
                : CommonStyles.displayNone,
              styles.iconContainer,
            ]}>
            <Icon
              name="expand-less"
              type="material"
              onPress={() => setShowOperation(false)}
            />
          </View>
          <View
            style={[
              showOperation
                ? CommonStyles.displayNone
                : CommonStyles.displayFlex,
              styles.iconContainer,
            ]}>
            <Icon
              name="expand-more"
              type="material"
              onPress={() => setShowOperation(true)}
            />
          </View>
        </View>
        <View style={styles.detailIconContainer}>
          <Icon
            name="chevron-right"
            type="material"
            onPress={gotoRecordItemList}
          />
        </View>
      </View>
      <View style={styles.operationContainer}>
        <View
          style={[
            showOperation ? CommonStyles.displayFlex : CommonStyles.displayNone,
          ]}>
          {OperationComponent}
        </View>
      </View>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  displayContainer: {
    width: '100%',
    flexDirection: 'row',
    alignContent: 'center',
  },
  operationContainer: {
    width: '100%',
  },
  indexContainer: {},
  indexText: {},
  operationIconContainer: {},
  detailIconContainer: {},
  iconContainer: {},
});

export default AbstractRecord;
