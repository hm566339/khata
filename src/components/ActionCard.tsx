import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '@constants';

interface ActionCardProps {
  icon: string;
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  label,
  onPress,
  backgroundColor = COLORS.primary,
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.card,
        {
          backgroundColor,
          ...SHADOWS.md,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: SIZES.borderRadiusLg,
    padding: SIZES.lg,
    marginHorizontal: SIZES.sm,
    marginVertical: SIZES.md,
    minWidth: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 36,
    marginBottom: SIZES.sm,
  },
  label: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: '600',
    color: COLORS.white,
    textAlign: 'center',
  },
});
