import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {BottomSheet, Icon, ListItem} from 'react-native-elements';
import CommonStyles from '../common/CommonStyles';

export type BottomDeleteSheetProps = {
  visible: boolean;
  onDelete: () => void;
  onClose: () => void;
};

const BottomDeleteSheet = ({
  visible,
  onDelete,
  onClose,
}: BottomDeleteSheetProps) => {
  const operations = [
    {
      title: '删除',
      containerStyle: {backgroundColor: 'red'},
      titleStyle: {
        color: 'white',
        textAlign: 'center' as 'auto' | 'left' | 'right' | 'center' | 'justify',
      },
      onPress: async () => {
        await onDelete();
      },
    },
    {
      title: '取消',
      titleStyle: {
        textAlign: 'center' as 'auto' | 'left' | 'right' | 'center' | 'justify',
      },
      onPress: () => onClose(),
    },
  ];
  return (
    <View
      style={[
        styles.container,
        visible ? CommonStyles.displayFlex : CommonStyles.displayNone,
      ]}>
      <Icon size={25} name={'delete'} onPress={onDelete} color={'red'} />
      <Text style={styles.deleteText}>删除</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemContent: {
    justifyContent: 'center',
  },
  deleteText: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default BottomDeleteSheet;
