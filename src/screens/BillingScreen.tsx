import {
    Button,
    Card,
    CurrencyDisplay,
    Dropdown,
    Header,
    Loading,
    TextInput,
} from "@components";
import { COLORS, LABELS_HI, SIZES } from "@constants";
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
          <Card>
            <Text style={styles.sectionTitle}>बिल आइटम</Text>
            <FlatList
              scrollEnabled={false}
              data={billingItems}
              keyExtractor={(item) => item.productId.toString()}
              renderItem={({ item }) => (
                <View style={styles.billItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.productName}</Text>
                    <Text style={styles.itemDetails}>
                      {item.quantity} x ₹{item.price.toFixed(2)} = ₹
                      {item.total.toFixed(2)}
                    </Text>
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
        <Card>
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

          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>कुल राशि:</Text>
            <CurrencyDisplay amount={total} size="large" />
          </View>
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
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  itemDetails: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.errorLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SIZES.md,
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  totalLabel: {
    fontSize: SIZES.fontSizeMd,
    color: COLORS.textSecondary,
  },
  finalTotal: {
    borderBottomWidth: 0,
    backgroundColor: COLORS.gray50,
    paddingHorizontal: SIZES.md,
    marginHorizontal: -SIZES.md,
    paddingVertical: SIZES.lg,
    marginVertical: SIZES.md,
  },
  finalTotalLabel: {
    fontSize: SIZES.fontSizeLg,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  actionButtons: {
    marginBottom: SIZES.lg,
  },
  addProduct: {
    marginBottom: 0,
  },
});
