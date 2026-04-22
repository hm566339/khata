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
} from "react-native";

export const SettingsScreen: React.FC = () => {
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [autoBackup, setAutoBackup] = useState(true);

  const handleResetDatabase = () => {
    Alert.alert("सावधान!", "यह सभी डेटा को हटा देगा। क्या आप निश्चित हैं?", [
      { text: "रद्द करें" },
      {
        text: "हटाएँ",
        onPress: async () => {
          try {
            await db.resetDatabase();
            Alert.alert("सफल", "डेटाबेस रीसेट किया गया");
          } catch (error) {
            Alert.alert("त्रुटि", "रीसेट में विफल");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleExportData = () => {
    Alert.alert("जानकारी", "डेटा निर्यात सुविधा जल्द आ रही है।");
  };

  return (
    <View style={styles.container}>
      <Header title={LABELS_HI.settings} />

      <ScrollView style={styles.content}>
        {/* Business Settings */}
        <Card>
          <Text style={styles.sectionTitle}>व्यावसायिक सेटिंग्स</Text>

          <TextInput
            label={LABELS_HI.lowStockThreshold}
            placeholder="कम स्टॉक सीमा"
            value={lowStockThreshold}
            onChangeText={setLowStockThreshold}
            keyboardType="numeric"
          />

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>स्वचालित बैकअप</Text>
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
          <Text style={styles.sectionTitle}>डेटा प्रबंधन</Text>

          <Button
            title={LABELS_HI.exportData}
            onPress={handleExportData}
            variant="secondary"
            style={{ marginBottom: SIZES.md }}
          />

          <Button
            title="डेटा बैकअप करें"
            onPress={() => Alert.alert("सफल", "डेटा बैकअप किया गया")}
            variant="secondary"
            style={{ marginBottom: SIZES.md }}
          />

          <Button
            title={LABELS_HI.importData}
            onPress={() => Alert.alert("सूचना", "आयात सुविधा जल्द आ रही है")}
            variant="outline"
            style={{ marginBottom: 0 }}
          />
        </Card>

        {/* App Info */}
        <Card>
          <Text style={styles.sectionTitle}>{LABELS_HI.aboutApp}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ऐप नाम:</Text>
            <Text style={styles.infoValue}>खाता (Khata)</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>संस्करण:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>विकास:</Text>
            <Text style={styles.infoValue}>छोटे दुकानदारों के लिए</Text>
          </View>
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text style={styles.sectionTitle}>खतरनाक क्षेत्र</Text>

          <Button
            title="सभी डेटा हटाएँ"
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
