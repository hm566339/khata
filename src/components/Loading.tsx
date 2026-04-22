import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '@constants';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = COLORS.primary,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
