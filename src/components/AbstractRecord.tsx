import React, {createRef, useState} from 'react';
import {
  LayoutChangeEvent,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RecordType} from '../database/realm';
import {
  Button,
  ButtonGroup,
  Icon,
  ListItem,
  Tooltip,
  TooltipProps,
} from 'react-native-elements';
import CommonStyles from '../common/CommonStyles';
import {useNavigation} from '@react-navigation/core';
import DashedLine from './DashedLine';

export type Props = {
  renderProps: ListRenderItemInfo<RecordType>;
  OperationComponent: React.FC | React.Component | Element;
  onDelete: () => Promise<boolean>;
};

const AbstractRecord: React.FC<Props> = ({
  renderProps,
  OperationComponent,
  onDelete,
}: Props) => {
  const navigation = useNavigation();
  const {item, index} = renderProps;
  const [showOperation, setShowOperation] = useState(false);
  const [height, setHeight] = useState(100);
  const [popover, setPopover] = useState(false);
  const listItemRef = createRef();
  const tooltipRef = createRef();
  const gotoRecordItemList = () => {
    navigation.navigate('RecordItemList', {recordId: item._id.toHexString()});
  };
  const onChoose = (idx: number) => {
    console.log('onChoose idx', idx);
    if (idx === 0) {
      onDelete().then(success => {
        success && tooltipRef.current?.toggleTooltip();
      });
    } else {
      tooltipRef.current?.toggleTooltip();
    }
  };
  const onLayout = (event: LayoutChangeEvent) => {
    const {
      nativeEvent: {
        layout: {width, height, x, y},
      },
    } = event;
    console.log('onLayout', {width, height, x, y});
    setHeight(height);
  };
  return (
    <Tooltip
      ref={tooltipRef}
      containerStyle={{padding: 0}}
      backgroundColor={'#222222'}
      height={30}
      width={120}
      toggleAction={'onLongPress' as 'onPress'}
      withOverlay={false}
      skipAndroidStatusBar={false}
      onOpen={() => setPopover(true)}
      onClose={() => setPopover(false)}
      popover={
        <ButtonGroup
          onPress={onChoose}
          containerStyle={{height: 30, borderWidth: 0}}
          buttonStyle={{backgroundColor: '#222222'}}
          textStyle={{color: 'white'}}
          buttons={['删除', '取消']}
        />
      }>
      <ListItem
        // onLayout={onLayout}
        containerStyle={[
          styles.container,
          {backgroundColor: popover ? '#aaaaaa' : '#ffffff'},
          {height: showOperation ? 100 : 50},
        ]}
        bottomDivider>
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
              showOperation
                ? CommonStyles.displayFlex
                : CommonStyles.displayNone,
            ]}>
            <View style={styles.dashedLineContainer}>
              <DashedLine horiz={true} />
            </View>
            <View style={styles.operationRecord}>{OperationComponent}</View>
          </View>
        </View>
      </ListItem>
    </Tooltip>
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
