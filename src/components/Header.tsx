import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SIZES } from '@constants';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightElement,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.rightContent}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  leftContent: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.fontSizeXl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  rightContent: {
    marginLeft: SIZES.md,
  },
});
