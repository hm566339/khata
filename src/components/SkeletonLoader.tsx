import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Animated } from 'react-native';
import { COLORS, SIZES, ANIMATIONS } from '@constants';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'text' | 'avatar' | 'card' | 'line';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = SIZES.borderRadiusMd,
  style,
  variant = 'text',
}) => {
  const shimmerOpacity = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerOpacity, {
          toValue: 1,
          duration: ANIMATIONS.normal,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerOpacity, {
          toValue: 0.3,
          duration: ANIMATIONS.normal,
          useNativeDriver: false,
        }),
      ])
    );
    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerOpacity]);

  const getSize = () => {
    switch (variant) {
      case 'avatar':
        return { width: SIZES.avatarSizeMedium, height: SIZES.avatarSizeMedium, borderRadius: SIZES.avatarSizeMedium / 2 };
      case 'card':
        return { width: '100%', height: 150, borderRadius: SIZES.borderRadiusLg };
      case 'line':
        return { width: '100%', height: 12, borderRadius: SIZES.borderRadiusMd };
      case 'text':
      default:
        return { width, height, borderRadius };
    }
  };

  const size = getSize();

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          ...size,
          opacity: shimmerOpacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: COLORS.gray200,
    marginBottom: SIZES.md,
  },
});
