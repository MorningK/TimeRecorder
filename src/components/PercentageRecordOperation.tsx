import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-elements';

export type Props = {
  onComplete: (data: {
    value: number | string;
    step?: number;
  }) => Promise<boolean>;
};
const count = 5;

const PercentageRecordOperation: React.FC<Props> = ({onComplete}: Props) => {
  const onFinishRating = async (rating: number) => {
    console.log('onFinishRating', rating);
    const success = await onComplete({value: rating / count});
    console.log('save result', success);
  };
  return (
    <View style={styles.container}>
      <Rating
        ratingCount={count}
        fractions={1}
        onFinishRating={onFinishRating}
        showRating={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PercentageRecordOperation;
