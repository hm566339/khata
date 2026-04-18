import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '@constants';

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

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderWidth,
          borderColor,
          ...getPadding(),
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
