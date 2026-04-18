import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { COLORS, SIZES, SHADOWS, ANIMATIONS } from '@constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const getBackgroundColor = () => {
    if (disabled) return COLORS.gray300;
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.secondary;
      case 'danger':
        return COLORS.error;
      case 'success':
        return COLORS.success;
      case 'outline':
        return COLORS.white;
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return COLORS.primary;
    return COLORS.white;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: SIZES.sm, paddingHorizontal: SIZES.md };
      case 'large':
        return { paddingVertical: SIZES.lg, paddingHorizontal: SIZES.xl };
      default:
        return { paddingVertical: SIZES.md, paddingHorizontal: SIZES.lg };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return SIZES.fontSizeSm;
      case 'large':
        return SIZES.fontSizeLg;
      default:
        return SIZES.fontSizeMd;
    }
  };

  const borderWidth = variant === 'outline' ? 2 : 0;
  const borderColor = variant === 'outline' ? COLORS.primary : 'transparent';

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: ANIMATIONS.pressScale,
      duration: ANIMATIONS.veryFast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: ANIMATIONS.veryFast,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderWidth,
            borderColor,
            ...getPadding(),
            ...SHADOWS.sm,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getFontSize(),
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: SIZES.borderRadiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 44,
  },
  text: {
    fontWeight: '600',
  },
});
