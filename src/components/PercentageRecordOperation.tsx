import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-elements';

export type Props = {
  onComplete?: (data: {
    value: number | string;
    step?: number;
  }) => Promise<boolean>;
  readonly?: boolean;
  value?: number;
  showRating?: boolean;
  imageSize?: number;
};
const count = 10;

const PercentageRecordOperation: React.FC<Props> = ({
  onComplete,
  readonly,
  value,
  showRating = false,
  imageSize = 25,
}: Props) => {
  const onFinishRating = async (rating: number) => {
    if (onComplete) {
      console.log('onFinishRating', rating);
      const success = await onComplete({value: rating / count});
      console.log('save result', success);
    }
  };
  return (
    <View style={styles.container}>
      <Rating
        ratingCount={count}
        readonly={readonly}
        startingValue={value ? value * count : 0}
        fractions={1}
        onFinishRating={onFinishRating}
        showRating={showRating}
        imageSize={imageSize}
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
