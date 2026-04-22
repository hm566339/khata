import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '@constants';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  subtitle,
  action,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {action && (
        <View style={styles.actionContainer}>
          <Text style={styles.actionText}>{action.label}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    paddingHorizontal: SIZES.lg,
  },
  icon: {
    fontSize: 64,
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.fontSizeLg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.fontSizeMd,
    color: COLORS.textSecondary,
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  actionContainer: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.borderRadiusMd,
    marginTop: SIZES.md,
  },
  actionText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.fontSizeMd,
  },
});
