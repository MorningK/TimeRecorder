import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CommonStyles from '../common/CommonStyles';
import {Icon} from 'react-native-elements';

export type MoreLessIconProps = {
  expand: boolean;
  onExpandChange: (expand: boolean) => void;
};

const MoreLessIcon: React.FC<MoreLessIconProps> = ({
  expand,
  onExpandChange,
}: MoreLessIconProps) => {
  return (
    <View>
      <View
        style={[expand ? CommonStyles.displayFlex : CommonStyles.displayNone]}>
        <Icon
          name="expand-less"
          type="material"
          onPress={() => onExpandChange(false)}
        />
      </View>
      <View
        style={[expand ? CommonStyles.displayNone : CommonStyles.displayFlex]}>
        <Icon
          name="expand-more"
          type="material"
          onPress={() => onExpandChange(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MoreLessIcon;
