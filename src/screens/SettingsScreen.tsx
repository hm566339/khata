import { Button, Card, Header, TextInput, Badge } from "@components";
import { COLORS, LABELS_HI, SIZES, SHADOWS } from "@constants";
import * as db from "@database/queries";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@i18n/LanguageContext";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@i18n/config";

export const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { currentLanguage, setLanguage } = useLanguage();
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [autoBackup, setAutoBackup] = useState(true);

  const handleResetDatabase = () => {
    Alert.alert(t("common.warning"), t("settings.clear_data_warning"), [
      { text: t("common.cancel") },
      {
        text: t("common.delete"),
        onPress: async () => {
          try {
            await db.resetDatabase();
            Alert.alert(t("common.success"), t("messages.data_cleared"));
          } catch (error) {
            Alert.alert(t("common.error"), "Reset failed");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleExportData = () => {
    Alert.alert(t("common.warning"), t("messages.data_exported"));
  };

  return (
    <View style={styles.container}>
      <Header title={t("settings.title")} />

      <ScrollView style={styles.content}>
        {/* Language Settings */}
        <Card>
          <Text style={styles.sectionTitle}>{t("settings.language")}</Text>
          
          <View style={styles.languageContainer}>
            {(Object.entries(SUPPORTED_LANGUAGES) as [LanguageCode, typeof SUPPORTED_LANGUAGES[LanguageCode]][]).map(
              ([langCode, langInfo]) => (
                <TouchableOpacity
                  key={langCode}
                  style={[
                    styles.languageButton,
                    currentLanguage === langCode && styles.languageButtonActive,
                  ]}
                  onPress={() => setLanguage(langCode)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      currentLanguage === langCode && styles.languageButtonTextActive,
                    ]}
                  >
                    {langInfo.flag} {langInfo.name}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </Card>

        {/* Business Settings */}
        <Card>
          <Text style={styles.sectionTitle}>{t("settings.account")}</Text>

          <TextInput
            label={LABELS_HI.lowStockThreshold}
            placeholder={t("transactions.amount")}
            value={lowStockThreshold}
            onChangeText={setLowStockThreshold}
            keyboardType="numeric"
          />

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>{t("settings.backup")}</Text>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: COLORS.gray300, true: COLORS.primaryLight }}
              thumbColor={autoBackup ? COLORS.primary : COLORS.gray500}
            />
          </View>
        </Card>

        {/* Data Management */}
        <Card>
          <Text style={styles.sectionTitle}>{t("settings.account")}</Text>

          <Button
            title={t("settings.export_data")}
            onPress={handleExportData}
            variant="secondary"
            style={{ marginBottom: SIZES.md }}
          />

          <Button
            title={t("settings.backup")}
            onPress={() => Alert.alert(t("common.success"), t("messages.data_exported"))}
            variant="secondary"
            style={{ marginBottom: SIZES.md }}
          />

          <Button
            title={t("settings.import_data")}
            onPress={() => Alert.alert(t("common.warning"), t("messages.data_imported"))}
            variant="outline"
            style={{ marginBottom: 0 }}
          />
        </Card>

        {/* App Info */}
        <Card>
          <Text style={styles.sectionTitle}>{t("settings.about")}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("common.app_name")}:</Text>
            <Text style={styles.infoValue}>Khata</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("settings.version")}:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{t("settings.account")}:</Text>
            <Text style={styles.infoValue}>{t("common.app_name")}</Text>
          </View>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text style={styles.sectionTitle}>{t("settings.account")}</Text>

          <Button
            title={t("settings.clear_data")}
            onPress={handleResetDatabase}
            variant="danger"
            style={{ marginBottom: 0 }}
          />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background || COLORS.gray50,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
  },
  sectionTitle: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "700",
    color: COLORS.text || COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  languageContainer: {
    flexDirection: "row",
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  languageButton: {
    flex: 1,
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.sm,
    borderRadius: SIZES.borderRadius,
    borderWidth: 2,
    borderColor: COLORS.border || COLORS.gray300,
    backgroundColor: COLORS.gray50,
    alignItems: "center",
  },
  languageButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  languageButtonText: {
    fontSize: SIZES.fontSizeSm,
    fontWeight: "600",
    color: COLORS.text || COLORS.textPrimary,
  },
  languageButtonTextActive: {
    color: COLORS.primary,
    fontWeight: "700",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border || COLORS.gray200,
  },
  settingLabel: {
    fontSize: SIZES.fontSizeMd,
    color: COLORS.text || COLORS.textPrimary,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || COLORS.gray100,
  },
  infoLabel: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.text || COLORS.textPrimary,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
    ...SHADOWS.sm,
  },
});
