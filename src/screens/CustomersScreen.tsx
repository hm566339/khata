import {
    Button,
    Card,
    CurrencyDisplay,
    Header,
    Loading,
    TextInput,
} from "@components";
import { COLORS, LABELS_HI, SIZES } from "@constants";
import * as db from "@database/queries";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface CustomerWithBalance extends db.Customer {
  balance?: number;
}

export const CustomersScreen: React.FC = () => {
  const router = useRouter();
  const [customers, setCustomers] = useState<CustomerWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const loadCustomers = useCallback(async () => {
    try {
      const customersData = await db.getCustomers();

      // Get balance for each customer
      const customersWithBalance = await Promise.all(
        customersData.map(async (customer) => {
          const balance = await db.getTotalUdhaarByCustomer(customer.id);
          return { ...customer, balance };
        }),
      );

      setCustomers(customersWithBalance);
    } catch (error) {
      console.error("Failed to load customers:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
    }, [loadCustomers]),
  );

  const handleAddCustomer = async () => {
    if (!formData.name.trim()) {
      Alert.alert("त्रुटि", "कृपया ग्राहक का नाम दर्ज करें");
      return;
    }

    try {
      await db.addCustomer(
        formData.name,
        formData.phone || undefined,
        formData.email || undefined,
        formData.address || undefined,
      );

      Alert.alert("सफल", "ग्राहक सफलतापूर्वक जोड़ा गया");
      setFormData({ name: "", phone: "", email: "", address: "" });
      setShowAddForm(false);
      loadCustomers();
    } catch (error) {
      console.error("Failed to add customer:", error);
      Alert.alert("त्रुटि", "ग्राहक जोड़ने में विफल");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCustomers();
  }, [loadCustomers]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={LABELS_HI.customers}
        rightElement={
          <TouchableOpacity
            onPress={() => setShowAddForm(!showAddForm)}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        }
      />

      {showAddForm && (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>नया ग्राहक जोड़ें</Text>

          <TextInput
            label={LABELS_HI.customerName}
            placeholder="नाम दर्ज करें"
            value={formData.name}
            onChangeText={(name: string) => setFormData({ ...formData, name })}
          />

          <TextInput
            label={LABELS_HI.phone}
            placeholder="फोन नंबर"
            value={formData.phone}
            onChangeText={(phone: string) =>
              setFormData({ ...formData, phone })
            }
            keyboardType="phone-pad"
          />

          <TextInput
            label={LABELS_HI.email}
            placeholder="ईमेल (वैकल्पिक)"
            value={formData.email}
            onChangeText={(email: string) =>
              setFormData({ ...formData, email })
            }
            keyboardType="email-address"
          />

          <TextInput
            label={LABELS_HI.address}
            placeholder="पता (वैकल्पिक)"
            value={formData.address}
            onChangeText={(address: string) =>
              setFormData({ ...formData, address })
            }
            multiline
            numberOfLines={3}
          />

          <View style={styles.formButtons}>
            <Button
              title={LABELS_HI.save}
              onPress={handleAddCustomer}
              style={{ flex: 1, marginRight: SIZES.md }}
            />
            <Button
              title={LABELS_HI.cancel}
              onPress={() => {
                setShowAddForm(false);
                setFormData({ name: "", phone: "", email: "", address: "" });
              }}
              variant="outline"
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      )}

      {customers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>कोई ग्राहक नहीं</Text>
          <Button
            title="नया ग्राहक जोड़ें"
            onPress={() => setShowAddForm(true)}
            style={{ marginTop: SIZES.lg }}
          />
        </View>
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push("/customer-detail?customerId=" + item.id)
              }
              activeOpacity={0.7}
            >
              <Card style={styles.customerCard}>
                <View style={styles.customerHeader}>
                  <View style={styles.customerInfo}>
                    <Text style={styles.customerName}>{item.name}</Text>
                    {item.phone && (
                      <Text style={styles.customerPhone}>{item.phone}</Text>
                    )}
                  </View>
                  {item.balance !== undefined && item.balance > 0 && (
                    <View style={styles.balanceContainer}>
                      <Text style={styles.balanceLabel}>बकाया</Text>
                      <CurrencyDisplay amount={item.balance} size="medium" />
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          )}
          scrollEnabled={true}
          style={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: SIZES.fontSizeXl,
    fontWeight: "bold",
  },
  formCard: {
    margin: SIZES.md,
    marginBottom: SIZES.md,
  },
  formTitle: {
    fontSize: SIZES.fontSizeLg,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  formButtons: {
    flexDirection: "row",
    marginBottom: 0,
  },
  list: {
    flex: 1,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  customerCard: {
    marginBottom: SIZES.md,
  },
  customerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  customerPhone: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  balanceLabel: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.lg,
  },
  emptyStateText: {
    fontSize: SIZES.fontSizeLg,
    color: COLORS.textSecondary,
    marginBottom: SIZES.lg,
  },
});
