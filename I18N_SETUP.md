# Khata i18n (Internationalization) Setup

This document explains the multi-language support implementation in the Khata app.

## Overview

The Khata app now supports multiple languages with full i18n integration using:
- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next
- **AsyncStorage** - Persistent language preference storage

## Supported Languages

- **English** (en) - 🇬🇧
- **Hindi** (hi) - 🇮🇳

## File Structure

```
locales/
├── en.json          # English translations
└── hi.json          # Hindi translations

src/
├── i18n/
│   ├── config.ts    # i18next configuration
│   └── LanguageContext.tsx  # Language context provider
├── components/
│   └── LanguageSwitcher.tsx # Language switcher component
└── screens/
    ├── DashboardScreen.tsx   # Updated with translations
    ├── BillingScreen.tsx     # Updated with translations
    ├── CustomersScreen.tsx   # Updated with translations
    ├── SettingsScreen.tsx    # Updated with translations (language toggle)
    └── InventoryScreen.tsx   # Updated with translations
```

## Usage

### Using Translations in Components

```tsx
import { useTranslation } from 'react-i18next';

export const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <View>
      <Text>{t('common.app_name')}</Text>
      <Button title={t('common.save')} />
    </View>
  );
};
```

### Using Language Context

```tsx
import { useLanguage } from '@i18n/LanguageContext';

export const MyComponent = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  return (
    <Button 
      title="Switch to Hindi"
      onPress={() => setLanguage('hi')}
    />
  );
};
```

## How It Works

1. **App Initialization**: The `LanguageProvider` wraps the entire app in `_layout.tsx`
2. **Language Loading**: On app startup, the saved language preference is loaded from AsyncStorage
3. **Default Language**: If no saved preference exists, English (en) is used as default
4. **Persistence**: When user changes language in Settings, it's automatically saved to AsyncStorage
5. **UI Updates**: All connected components automatically re-render with new translations

## Adding New Translations

1. Add the translation key-value pairs to both `locales/en.json` and `locales/hi.json`
2. Use the new key in components with `t('path.to.key')`

Example:
```json
// locales/en.json
{
  "common": {
    "welcome": "Welcome to Khata"
  }
}

// locales/hi.json
{
  "common": {
    "welcome": "खाता में स्वागत है"
  }
}
```

Then use in component:
```tsx
<Text>{t('common.welcome')}</Text>
```

## Translation Keys Structure

Translations are organized by feature/screen:

- **common** - Global UI strings (OK, Cancel, Save, etc.)
- **navigation** - Tab and screen names
- **dashboard** - Dashboard screen strings
- **transactions** - Transactions/Billing screen strings
- **contacts** - Customers/Contacts screen strings
- **reports** - Reports/Analytics screen strings
- **settings** - Settings screen strings
- **messages** - Alert messages and notifications

## Current Coverage

All main screens now use i18n:
- Dashboard Screen
- Billing/Transactions Screen
- Customers/Contacts Screen
- Inventory Screen
- Settings Screen (with language switcher)
- Tab Navigation Labels

## Tab Navigation Names

Tab names in the bottom navigation are also translated and will update when the user changes language:
- Dashboard / डैशबोर्ड
- Transactions / लेनदेन
- Contacts / संपर्क
- Reports / रिपोर्ट
- Settings / सेटिंग्स

## Language Preference Persistence

The app automatically saves the selected language to device storage using AsyncStorage. When the app is relaunched, the previously selected language is restored.

## Future Enhancements

- Add more languages (Marathi, Gujarati, Kannada, etc.)
- Implement RTL (Right-to-Left) support for Arabic/Urdu
- Add language-specific number formatting
- Create language-specific themes (if needed)
- Add language-specific fonts for better typography

## Troubleshooting

### Translations not updating
- Ensure `LanguageProvider` wraps all screens in `_layout.tsx`
- Check that the translation key exists in both en.json and hi.json
- Verify the import: `import { useTranslation } from 'react-i18next'`

### Language not persisting
- Check that AsyncStorage is properly installed
- Verify LanguageContext is properly initialized
- Check AsyncStorage permissions in app.json

### Missing translations
- Add the key to both en.json and hi.json
- Use the exact key path in the `t()` function
- Check for typos in translation keys

## Testing Languages

To test the language switching:
1. Open the Settings tab
2. Look for the "Language" section at the top
3. Click on English (🇬🇧) or हिन्दी (🇮🇳) buttons to switch
4. The entire app UI will update to the selected language
5. Restart the app to verify language persistence
