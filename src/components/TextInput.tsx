import React from 'react';
import { View, TextInput as RNTextInput, StyleSheet, Text } from 'react-native';
import { COLORS, SIZES } from '@constants';

interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'phone-pad' | 'email-address';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  disabled?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={!disabled}
        placeholderTextColor={COLORS.textLight}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  label: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: SIZES.borderRadiusMd,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    fontSize: SIZES.fontSizeMd,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputDisabled: {
    backgroundColor: COLORS.gray100,
    color: COLORS.gray500,
  },
  error: {
    color: COLORS.error,
    fontSize: SIZES.fontSizeSm,
    marginTop: SIZES.sm,
  },
});
