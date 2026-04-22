import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native';
import { useLanguage } from '@i18n/LanguageContext';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@i18n/config';
import { COLORS, SIZES } from '@constants';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      {(Object.entries(SUPPORTED_LANGUAGES) as [LanguageCode, typeof SUPPORTED_LANGUAGES[LanguageCode]][]).map(
        ([langCode, langInfo]) => (
          <TouchableOpacity
            key={langCode}
            style={[
              styles.button,
              currentLanguage === langCode && styles.buttonActive,
            ]}
            onPress={() => setLanguage(langCode)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.text,
                currentLanguage === langCode && styles.textActive,
              ]}
            >
              {langInfo.flag} {langInfo.name}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  button: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.borderRadius,
    borderWidth: 2,
    borderColor: COLORS.border || COLORS.gray300,
    backgroundColor: COLORS.gray50,
    alignItems: 'center',
  },
  buttonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  text: {
    fontSize: SIZES.fontSizeSm,
    fontWeight: '600',
    color: COLORS.text || COLORS.textPrimary,
  },
  textActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});
