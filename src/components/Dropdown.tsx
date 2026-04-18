import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { COLORS, SIZES } from '@constants';

export interface DropdownOption {
  label: string;
  value: any;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: any;
  onSelect: (value: any) => void;
  placeholder?: string;
  error?: string;
  style?: ViewStyle;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  error,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.trigger, error && styles.triggerError]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.triggerText, !value && styles.placeholderText]}>
          {selectedLabel}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modal}>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    value === option.value && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === option.value && styles.selectedOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  trigger: {
    borderWidth: 1,
    borderColor: COLORS.gray300,
    borderRadius: SIZES.borderRadiusMd,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  triggerError: {
    borderColor: COLORS.error,
  },
  triggerText: {
    fontSize: SIZES.fontSizeMd,
    color: COLORS.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.textLight,
  },
  arrow: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontSizeSm,
    marginLeft: SIZES.md,
  },
  error: {
    color: COLORS.error,
    fontSize: SIZES.fontSizeSm,
    marginTop: SIZES.sm,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.borderRadiusLg,
    borderTopRightRadius: SIZES.borderRadiusLg,
    maxHeight: '60%',
    paddingTop: SIZES.md,
  },
  optionsList: {
    paddingHorizontal: SIZES.md,
  },
  option: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  selectedOption: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.borderRadiusMd,
    borderBottomColor: COLORS.primaryLight,
  },
  optionText: {
    fontSize: SIZES.fontSizeMd,
    color: COLORS.textPrimary,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
