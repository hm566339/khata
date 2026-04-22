import {
    Button,
    Card,
    CurrencyDisplay,
    Header,
    Loading,
    StatusBadge,
    TextInput,
} from "@components";
import { COLORS, LABELS_HI, SIZES } from "@constants";
import * as db from "@database/queries";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export const CustomerDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const customerId = params.customerId
    ? parseInt(params.customerId as string)
    : null;
  const [customer, setCustomer] = useState<db.Customer | null>(null);
  const [udhaarEntries, setUdhaarEntries] = useState<db.Udhaar[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedUdhaarId, setSelectedUdhaarId] = useState<number | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [customerData, udhaarData, balance] = await Promise.all([
        db.getCustomerById(customerId),
        db.getUdhaarByCustomer(customerId),
        db.getTotalUdhaarByCustomer(customerId),
      ]);

      if (customerData) {
        setCustomer(customerData);
      }
      setUdhaarEntries(udhaarData);
      setTotalBalance(balance);
    } catch (error) {
      console.error("Failed to load customer details:", error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  const handleRecordPayment = async () => {
    if (!selectedUdhaarId || !paymentAmount) {
      Alert.alert("त्रुटि", "कृपया उधार और राशि चुनें");
      return;
    }

    try {
      await db.addPayment(selectedUdhaarId, parseFloat(paymentAmount));

      // Check if fully paid
      const totalPayment = await db.getTotalPaymentByUdhaar(selectedUdhaarId);
      const udhaarEntry = udhaarEntries.find((u) => u.id === selectedUdhaarId);

      if (udhaarEntry && totalPayment >= udhaarEntry.amount) {
        await db.updateUdhaarStatus(selectedUdhaarId, "paid");
      }

      Alert.alert("सफल", "भुगतान दर्ज किया गया");
      setPaymentAmount("");
      setSelectedUdhaarId(null);
      setShowPaymentForm(false);
      loadData();
    } catch (error) {
      console.error("Failed to record payment:", error);
      Alert.alert("त्रुटि", "भुगतान दर्ज करने में विफल");
    }
  };

  const sendWhatsAppReminder = async (amount: number) => {
    if (!customer?.phone) {
      Alert.alert("त्रुटि", "ग्राहक का फोन नंबर नहीं है");
      return;
    }

    const message = `नमस्ते ${customer.name}, आपका बकाया राशि ₹${amount.toFixed(2)} है। कृपया भुगतान करें।`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${customer.phone.replace(/\D/g, "")}?text=${encodedMessage}`;

    try {
      await Linking.openURL(whatsappUrl);
    } catch (error) {
      Alert.alert("त्रुटि", "WhatsApp खोलने में विफल");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!customer) {
    return (
      <View style={styles.container}>
        <Header title="ग्राहक विवरण" />
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>ग्राहक नहीं मिला</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={customer.name} />

      <ScrollView style={styles.content}>
        {/* Customer Info */}
        <Card>
          <Text style={styles.sectionTitle}>ग्राहक जानकारी</Text>
          {customer.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>फोन:</Text>
              <Text style={styles.infoValue}>{customer.phone}</Text>
            </View>
          )}
          {customer.email && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>ईमेल:</Text>
              <Text style={styles.infoValue}>{customer.email}</Text>
            </View>
          )}
          {customer.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>पता:</Text>
              <Text style={styles.infoValue}>{customer.address}</Text>
            </View>
          )}
        </Card>

        {/* Balance Summary */}
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>कुल बकाया राशि</Text>
          <CurrencyDisplay amount={totalBalance} size="large" />
          {totalBalance > 0 && (
            <Button
              title="याद दिलाना भेजें (WhatsApp)"
              onPress={() => sendWhatsAppReminder(totalBalance)}
              variant="secondary"
              style={{ marginTop: SIZES.lg, marginBottom: 0 }}
            />
          )}
        </Card>

        {/* Payment Form */}
        {showPaymentForm && (
          <Card>
            <Text style={styles.sectionTitle}>भुगतान दर्ज करें</Text>

            {udhaarEntries.map((udhaar) => {
              const totalPayment = udhaarEntries.reduce((sum, u) => {
                if (u.id === udhaar.id) return sum;
                return sum;
              }, 0);
              const remaining = udhaar.amount - totalPayment;

              return (
                <TouchableOpacity
                  key={udhaar.id}
                  onPress={() => setSelectedUdhaarId(udhaar.id)}
                  style={[
                    styles.udhaarOption,
                    selectedUdhaarId === udhaar.id &&
                      styles.udhaarOptionSelected,
                  ]}
                >
                  <View style={styles.udhaarInfo}>
                    <Text style={styles.udhaarDate}>
                      {new Date(udhaar.created_at).toLocaleDateString("hi-IN")}
                    </Text>
                    <Text style={styles.udhaarAmount}>
                      बकाया: ₹{remaining.toFixed(2)} (कुल: ₹
                      {udhaar.amount.toFixed(2)})
                    </Text>
                  </View>
                  <StatusBadge status={udhaar.status as any} />
                </TouchableOpacity>
              );
            })}

            <TextInput
              label="भुगतान राशि"
              placeholder="राशि दर्ज करें"
              value={paymentAmount}
              onChangeText={setPaymentAmount}
              keyboardType="decimal-pad"
            />

            <View style={styles.formButtons}>
              <Button
                title={LABELS_HI.save}
                onPress={handleRecordPayment}
                style={{ flex: 1, marginRight: SIZES.md }}
              />
              <Button
                title={LABELS_HI.cancel}
                onPress={() => {
                  setShowPaymentForm(false);
                  setPaymentAmount("");
                  setSelectedUdhaarId(null);
                }}
                variant="outline"
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        )}

        {!showPaymentForm && totalBalance > 0 && (
          <Button
            title="भुगतान दर्ज करें"
            onPress={() => setShowPaymentForm(true)}
            variant="success"
            style={{ marginHorizontal: SIZES.md, marginBottom: SIZES.md }}
          />
        )}

        {/* Udhaar History */}
        {udhaarEntries.length > 0 && (
          <Card>
            <Text style={styles.sectionTitle}>उधार का इतिहास</Text>
            <FlatList
              scrollEnabled={false}
              data={udhaarEntries}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.udhaarItem}>
                  <View style={styles.udhaarItemLeft}>
                    <Text style={styles.udhaarItemDate}>
                      {new Date(item.created_at).toLocaleDateString("hi-IN")}
                    </Text>
                    <Text style={styles.udhaarItemAmount}>
                      ₹{item.amount.toFixed(2)}
                    </Text>
                  </View>
                  <StatusBadge status={item.status as any} />
                </View>
              )}
            />
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  infoLabel: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textPrimary,
  },
  balanceCard: {
    backgroundColor: COLORS.primaryLight,
    padding: SIZES.lg,
  },
  balanceLabel: {
    fontSize: SIZES.fontSizeSm,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: SIZES.md,
  },
  udhaarOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    borderRadius: SIZES.borderRadiusMd,
    marginBottom: SIZES.md,
  },
  udhaarOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.gray50,
  },
  udhaarInfo: {
    flex: 1,
  },
  udhaarDate: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
  },
  udhaarAmount: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: SIZES.xs,
  },
  formButtons: {
    flexDirection: "row",
    marginBottom: 0,
  },
  udhaarItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  udhaarItemLeft: {
    flex: 1,
  },
  udhaarItemDate: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
  },
  udhaarItemAmount: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: SIZES.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: SIZES.fontSizeLg,
    color: COLORS.textSecondary,
  },
});
