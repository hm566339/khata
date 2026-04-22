import {
    Button,
    Card,
    CurrencyDisplay,
    Dropdown,
    Header,
    Loading,
    TextInput,
    Badge,
} from "@components";
import { COLORS, LABELS_HI, SIZES, SHADOWS } from "@constants";
import * as db from "@database/queries";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface BillingItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

export const BillingScreen: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<db.Product[]>([]);
  const [customers, setCustomers] = useState<db.Customer[]>([]);
  const [billingItems, setBillingItems] = useState<BillingItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [discount, setDiscount] = useState("0");
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("1");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, customersData] = await Promise.all([
          db.getProducts(),
          db.getCustomers(),
        ]);
        setProducts(productsData);
        setCustomers(customersData);
      } catch (error) {
        console.error("Failed to load data:", error);
        Alert.alert("त्रुटि", "डेटा लोड करने में विफल");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addItemToBill = () => {
    if (!selectedProduct || !quantity) {
      Alert.alert("त्रुटि", "कृपया उत्पाद और मात्रा चुनें");
      return;
    }

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    if (parseInt(quantity) > product.stock) {
      Alert.alert("त्रुटि", "अपर्याप्त स्टॉक उपलब्ध");
      return;
    }

    const qty = parseInt(quantity);
    const total = product.price * qty;

    const existingItem = billingItems.find(
      (item) => item.productId === selectedProduct,
    );
    if (existingItem) {
      existingItem.quantity += qty;
      existingItem.total = existingItem.price * existingItem.quantity;
      setBillingItems([...billingItems]);
    } else {
      setBillingItems([
        ...billingItems,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: qty,
          total,
        },
      ]);
    }

    setSelectedProduct(null);
    setQuantity("1");
  };

  const removeItem = (productId: number) => {
    setBillingItems(
      billingItems.filter((item) => item.productId !== productId),
    );
  };

  const calculateTotals = () => {
    const subtotal = billingItems.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = parseFloat(discount) || 0;
    const total = Math.max(0, subtotal - discountAmount);
    return { subtotal, discount: discountAmount, total };
  };

  const saveBill = async () => {
    if (billingItems.length === 0) {
      Alert.alert("त्रुटि", "कृपया कम से कम एक आइटम जोड़ें");
      return;
    }

    try {
      const { subtotal, discount: discountAmount, total } = calculateTotals();

      // Save invoice
      const invoiceId = await db.addInvoice(
        selectedCustomer,
        subtotal,
        discountAmount,
        total,
        "pending",
      );

      // Save invoice items and update stock
      for (const item of billingItems) {
        await db.addInvoiceItem(
          invoiceId,
          item.productId,
          item.quantity,
          item.price,
        );
        await db.updateProductStock(item.productId, -item.quantity);

        // If customer is selected, add udhaar
        if (selectedCustomer) {
          await db.addUdhaar(selectedCustomer, total, invoiceId);
        }
      }

      Alert.alert("सफल", "बिल सफलतापूर्वक सहेजा गया", [
        {
          text: "ठीक है",
          onPress: () => {
            setBillingItems([]);
            setSelectedCustomer(null);
            setDiscount("0");
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Failed to save bill:", error);
      Alert.alert("त्रुटि", "बिल सहेजने में विफल");
    }
  };

  const { subtotal, discount: discountAmount, total } = calculateTotals();

  const productOptions = products.map((p) => ({
    label: `${p.name} (${p.stock} स्टॉक)`,
    value: p.id,
  }));

  const customerOptions = customers.map((c) => ({
    label: c.name + (c.phone ? ` - ${c.phone}` : ""),
    value: c.id,
  }));

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header title={LABELS_HI.createBill} />

      <ScrollView style={styles.content}>
        {/* Customer Selection */}
        <Card>
          <Dropdown
            label={LABELS_HI.selectCustomer}
            options={customerOptions}
            value={selectedCustomer}
            onSelect={setSelectedCustomer}
            placeholder="ग्राहक चुनें (वैकल्पिक)"
          />
        </Card>

        {/* Product Selection */}
        <Card>
          <Text style={styles.sectionTitle}>आइटम जोड़ें</Text>

          <Dropdown
            label={LABELS_HI.selectProduct}
            options={productOptions}
            value={selectedProduct}
            onSelect={setSelectedProduct}
            placeholder="उत्पाद चुनें"
            style={{ marginBottom: SIZES.md }}
          />

          <TextInput
            label={LABELS_HI.quantity}
            placeholder="मात्रा दर्ज करें"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <Button
            title={LABELS_HI.addItem}
            onPress={addItemToBill}
            style={{ marginBottom: 0 }}
          />
        </Card>

        {/* Bill Items */}
        {billingItems.length > 0 && (
          <Card variant="elevated" animated>
            <View style={styles.itemsHeader}>
              <Text style={styles.sectionTitle}>बिल आइटम</Text>
              <Badge label={`${billingItems.length} आइटम`} variant="info" />
            </View>
            <FlatList
              scrollEnabled={false}
              data={billingItems}
              keyExtractor={(item) => item.productId.toString()}
              renderItem={({ item, index }) => (
                <View style={[styles.billItem, index !== billingItems.length - 1 && styles.billItemBorder]}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <View style={styles.itemDetailsRow}>
                      <Text style={styles.itemDetails}>
                        {item.quantity} × ₹{item.price.toLocaleString('hi-IN')}
                      </Text>
                      <Text style={styles.itemTotal}>
                        ₹{item.total.toLocaleString('hi-IN')}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeItem(item.productId)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </Card>
        )}

        {/* Totals */}
        <Card variant="elevated" animated style={styles.summaryCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>कुल:</Text>
            <CurrencyDisplay amount={subtotal} />
          </View>

          <TextInput
            label={LABELS_HI.discount}
            placeholder="छूट राशि"
            value={discount}
            onChangeText={setDiscount}
            keyboardType="decimal-pad"
          />

          <View style={styles.summaryDivider} />

          <View style={styles.finalTotal}>
            <Text style={styles.finalTotalLabel}>कुल राशि:</Text>
            <Text style={styles.finalTotalAmount}>₹{total.toLocaleString('hi-IN')}</Text>
          </View>
          
          {selectedCustomer && (
            <Badge label="उधार पर बिल" variant="warning" style={styles.udhaarBadge} />
          )}
        </Card>

        {/* Save Button */}
        {billingItems.length > 0 && (
          <View style={styles.actionButtons}>
            <Button
              title={LABELS_HI.saveBill}
              onPress={saveBill}
              style={{ marginBottom: SIZES.md }}
            />
            <Button
              title="रद्द करें"
              onPress={() => {
                setBillingItems([]);
                setSelectedCustomer(null);
                setDiscount("0");
              }}
              variant="outline"
              style={{ marginBottom: 0 }}
            />
          </View>
        )}
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
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.lg,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.md,
  },
  billItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || COLORS.gray200,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "600",
    color: COLORS.text || COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  itemDetails: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
  },
  itemDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTotal: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "700",
    color: COLORS.primary,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.errorLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SIZES.md,
    ...SHADOWS.sm,
  },
  removeButtonText: {
    color: COLORS.error,
    fontSize: SIZES.fontSizeLg,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.md,
  },
  totalLabel: {
    fontSize: SIZES.fontSizeMd,
    color: COLORS.textSecondary,
  },
  summaryCard: {
    marginBottom: SIZES.lg,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border || COLORS.gray200,
    marginVertical: SIZES.md,
  },
  finalTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.lg,
  },
  finalTotalLabel: {
    fontSize: SIZES.fontSizeLg,
    fontWeight: "700",
    color: COLORS.text || COLORS.textPrimary,
  },
  finalTotalAmount: {
    fontSize: SIZES.fontSizeXxl,
    fontWeight: "700",
    color: COLORS.primary,
  },
  udhaarBadge: {
    marginTop: SIZES.md,
  },
  actionButtons: {
    marginBottom: SIZES.lg,
    gap: SIZES.md,
  },
  addProduct: {
    marginBottom: 0,
  },
});
