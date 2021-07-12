import React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {RecordeTypes, RecordType} from '../common/constant';
import {CheckBox, Icon} from 'react-native-elements';

export type RecordTypeSelectionProps = {
  typeSelection: Set<number>;
  onTypeSelection: (value: number) => void;
};

const RecordTypeSelection: React.FC<RecordTypeSelectionProps> = ({
  typeSelection,
  onTypeSelection,
}: RecordTypeSelectionProps) => {
  const renderItem = ({
    item: recordType,
    index,
  }: {
    item: RecordType;
    index: number;
  }) => {
    return (
      <View key={recordType.value}>
        <CheckBox
          containerStyle={styles.checkboxContainer}
          checkedIcon={<Icon name="check-circle" color={'green'} />}
          uncheckedIcon={<Icon name="check-circle-outline" />}
          title={recordType.name}
          checked={typeSelection.has(recordType.value)}
          onPress={() => onTypeSelection(recordType.value)}
        />
      </View>
    );
  };
  return (
    <View style={styles.typeContainer}>
      <Text>记录类型：</Text>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.contentContainer}>
        {RecordeTypes.map((item, index) => renderItem({item, index}))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  typeContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#33333333',
    overflow: 'scroll',
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    color: 'black',
  },
  checkboxContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 0,
    borderWidth: 0,
    backgroundColor: 'white',
  },
});

export default RecordTypeSelection;
