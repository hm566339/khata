import {
    Button,
    Card,
    CurrencyDisplay,
    Header,
    Loading,
    TextInput,
    Avatar,
    Badge,
    EmptyState,
} from "@components";
import { COLORS, LABELS_HI, SIZES, SHADOWS } from "@constants";
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
import { useTranslation } from "react-i18next";

interface CustomerWithBalance extends db.Customer {
  balance?: number;
}

export const CustomersScreen: React.FC = () => {
  const { t } = useTranslation();
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
      Alert.alert(t("common.error"), "Please enter customer name");
      return;
    }

    try {
      await db.addCustomer(
        formData.name,
        formData.phone || undefined,
        formData.email || undefined,
        formData.address || undefined,
      );

      Alert.alert(t("common.success"), t("messages.contact_added"));
      setFormData({ name: "", phone: "", email: "", address: "" });
      setShowAddForm(false);
      loadCustomers();
    } catch (error) {
      console.error("Failed to add customer:", error);
      Alert.alert(t("common.error"), "Failed to add customer");
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
        title={t("contacts.title")}
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
          <Text style={styles.formTitle}>{t("contacts.add_new")}</Text>

          <TextInput
            label={t("contacts.name")}
            placeholder="Enter name"
            value={formData.name}
            onChangeText={(name: string) => setFormData({ ...formData, name })}
          />

          <TextInput
            label={t("contacts.phone")}
            placeholder="Phone number"
            value={formData.phone}
            onChangeText={(phone: string) =>
              setFormData({ ...formData, phone })
            }
            keyboardType="phone-pad"
          />

          <TextInput
            label={t("contacts.email")}
            placeholder="Email (optional)"
            value={formData.email}
            onChangeText={(email: string) =>
              setFormData({ ...formData, email })
            }
            keyboardType="email-address"
          />

          <TextInput
            label={t("common.app_name")}
            placeholder="Address (optional)"
            value={formData.address}
            onChangeText={(address: string) =>
              setFormData({ ...formData, address })
            }
            multiline
            numberOfLines={3}
          />

          <View style={styles.formButtons}>
            <Button
              title={t("common.save")}
              onPress={handleAddCustomer}
              style={{ flex: 1, marginRight: SIZES.md }}
            />
            <Button
              title={t("common.cancel")}
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
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="👥"
            title={t("contacts.no_contacts")}
            subtitle="Add your first contact to get started"
            action={{
              label: t("contacts.add_new"),
              onPress: () => setShowAddForm(true),
            }}
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
              <Card variant="elevated" animated style={styles.customerCard}>
                <View style={styles.customerContent}>
                  <Avatar name={item.name} size="medium" />
                  <View style={styles.customerInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.customerName}>{item.name}</Text>
                      {item.balance !== undefined && item.balance > 0 && (
                        <Badge
                          label={`${t("dashboard.pending")}: ₹${item.balance.toLocaleString()}`}
                          variant="pending"
                          size="small"
                        />
                      )}
                    </View>
                    {item.phone && (
                      <Text style={styles.customerPhone}>{item.phone}</Text>
                    )}
                  </View>
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
    backgroundColor: COLORS.background || COLORS.gray50,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.md,
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
    color: COLORS.text || COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  formButtons: {
    flexDirection: "row",
    marginBottom: 0,
    gap: SIZES.md,
  },
  list: {
    flex: 1,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  customerCard: {
    marginBottom: SIZES.md,
  },
  customerContent: {
    flexDirection: "row",
    gap: SIZES.md,
    alignItems: "flex-start",
  },
  customerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SIZES.xs,
  },
  customerName: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "600",
    color: COLORS.text || COLORS.textPrimary,
    flex: 1,
  },
  customerPhone: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
