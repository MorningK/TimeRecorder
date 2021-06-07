import React, {useState} from 'react';
import {ListRenderItemInfo, StyleSheet, Text, View} from 'react-native';
import {RecordType} from '../database/realm';
import {Icon, ListItem} from 'react-native-elements';
import CommonStyles from '../common/CommonStyles';
import {useNavigation} from '@react-navigation/core';
import DashedLine from './DashedLine';

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
        <View style={styles.recordNameContainer}>
          <Text style={styles.recordNameText}>{item.name}</Text>
        </View>
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
          <View style={styles.dashedLineContainer}>
            <DashedLine horiz={true} />
          </View>
          <View style={styles.operationRecord}>{OperationComponent}</View>
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
  indexContainer: {
    flex: 1,
  },
  indexText: {},
  recordNameContainer: {
    flex: 7,
  },
  recordNameText: {},
  operationIconContainer: {
    flex: 2,
  },
  detailIconContainer: {
    flex: 1,
  },
  iconContainer: {},
  dashedLineContainer: {
    marginVertical: 12,
  },
  operationRecord: {},
});

export default AbstractRecord;
