import React, {createRef, useEffect, useMemo, useRef, useState} from 'react';
import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {RecordType} from '../database/realm';
import {
  Button,
  ButtonGroup,
  Icon,
  ListItem,
  Tooltip,
} from 'react-native-elements';
import CommonStyles from '../common/CommonStyles';
import {useNavigation} from '@react-navigation/core';
import DashedLine from './DashedLine';
import MoreLessIcon from './MoreLessIcon';

export type Props = {
  renderProps: ListRenderItemInfo<RecordType>;
  OperationComponent: React.FC | React.Component | Element;
  onDelete: () => Promise<boolean>;
  onPrivateChange: () => Promise<boolean>;
};

const AbstractRecord: React.FC<Props> = ({
  renderProps,
  OperationComponent,
  onDelete,
  onPrivateChange,
}: Props) => {
  const navigation = useNavigation();
  const {item, index} = renderProps;
  const [showOperation, setShowOperation] = useState(false);
  const [popover, setPopover] = useState(false);
  const [forceClose, setForceClose] = useState(0);
  const tooltipRef = useRef();
  const windowSize = useWindowDimensions();
  const displayName = useMemo(() => {
    if (item.private && item.name.length > 1) {
      const name = item.name.trim();
      return name[0] + '***' + name[name.length - 1];
    } else {
      return item.name;
    }
  }, [item]);
  useEffect(() => {
    if (forceClose > 0 && tooltipRef.current !== null) {
      tooltipRef.current?.toggleTooltip();
    }
  }, [forceClose, tooltipRef]);
  const gotoRecordItemList = () => {
    navigation.navigate('RecordItemList', {recordId: item._id.toHexString()});
  };
  const onChoose = (idx: number) => {
    console.log('onChoose idx', idx);
    if (idx === 0) {
      onDelete().then(success => {
        success && setForceClose(state => state + 1);
      });
    } else if (idx === 1) {
      onPrivateChange().then(success => {
        console.log('is onPrivateChange success', success, tooltipRef.current);
        success && setForceClose(state => state + 1);
      });
    } else {
      tooltipRef.current?.toggleTooltip();
    }
  };
  return (
    <ListItem
      // onLayout={onLayout}
      containerStyle={[styles.container, popover && styles.popContainer]}
      bottomDivider>
      <View style={styles.displayContainer}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.recordNameContainer}>
          <Tooltip
            ref={tooltipRef}
            containerStyle={styles.tooltip}
            backgroundColor={'white'}
            height={50 * 3 + 10}
            width={25 * 4}
            toggleAction={'onLongPress' as 'onPress'}
            withOverlay={false}
            withPointer={false}
            skipAndroidStatusBar={false}
            onOpen={() => setPopover(true)}
            onClose={() => setPopover(false)}
            popover={
              <ButtonGroup
                onPress={onChoose}
                containerStyle={styles.bgContainer}
                buttonContainerStyle={styles.btnContainer}
                buttonStyle={styles.bgBtn}
                textStyle={styles.bgText}
                vertical={true}
                buttons={[
                  '删除',
                  item.private ? '设为公开' : '设为私密',
                  '取消',
                ]}
              />
            }>
            <Text style={styles.recordNameText}>{displayName}</Text>
          </Tooltip>
        </View>
        <View style={styles.operationIconContainer}>
          <MoreLessIcon
            expand={showOperation}
            onExpandChange={setShowOperation}
          />
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
            <DashedLine length={windowSize.width} horiz={true} />
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
    backgroundColor: '#ffffff',
  },
  popContainer: {
    backgroundColor: '#dddddd'
  },
  tooltip: {
    flex: 7,
    padding: 0,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  bgContainer: {
    height: 50 * 3,
    borderWidth: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bgBtn: {},
  bgText: {
    color: 'black',
  },
  btnContainer: {
    paddingVertical: 6,
    backgroundColor: 'white',
    borderBottomWidth: 0,
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
    width: '100%',
  },
  operationRecord: {},
});

export default AbstractRecord;
