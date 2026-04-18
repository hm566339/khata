import {
    Button,
    Card,
    Header,
    Loading,
    StatusBadge,
    TextInput,
    StockIndicator,
    EmptyState,
} from "@components";
import { BUSINESS, COLORS, LABELS_HI, SIZES, SHADOWS } from "@constants";
import * as db from "@database/queries";
import { useFocusEffect } from "@react-navigation/native";
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

export const InventoryScreen: React.FC = () => {
  const [products, setProducts] = useState<db.Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
  });

  const loadProducts = useCallback(async () => {
    try {
      const productsData = await db.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  const handleAddProduct = async () => {
    if (!formData.name.trim() || !formData.price || !formData.stock) {
      Alert.alert("त्रुटि", "कृपया सभी आवश्यक फील्ड भरें");
      return;
    }

    try {
      if (editingId) {
        await db.updateProduct(
          editingId,
          formData.name,
          parseFloat(formData.price),
          parseInt(formData.stock),
          formData.category || undefined,
        );
        Alert.alert("सफल", "उत्पाद अपडेट किया गया");
      } else {
        await db.addProduct(
          formData.name,
          parseFloat(formData.price),
          parseInt(formData.stock),
          formData.category || undefined,
        );
        Alert.alert("सफल", "उत्पाद जोड़ा गया");
      }

      setFormData({ name: "", price: "", stock: "", category: "" });
      setEditingId(null);
      setShowAddForm(false);
      loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);
      Alert.alert("त्रुटि", "उत्पाद सहेजने में विफल");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    Alert.alert("पुष्टि करें", "क्या आप यह उत्पाद हटाना चाहते हैं?", [
      {
        text: "रद्द करें",
        onPress: () => {},
      },
      {
        text: "हटाएँ",
        onPress: async () => {
          try {
            await db.deleteProduct(id);
            Alert.alert("सफल", "उत्पाद हटाया गया");
            loadProducts();
          } catch (error) {
            Alert.alert("त्रुटि", "उत्पाद हटाने में विफल");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleEditProduct = (product: db.Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || "",
    });
    setShowAddForm(true);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return "low";
    if (stock <= BUSINESS.defaultLowStockThreshold) return "pending";
    return "paid";
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return "स्टॉक खत्म";
    if (stock <= BUSINESS.defaultLowStockThreshold) return "कम स्टॉक";
    return "उपलब्ध";
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={LABELS_HI.inventory}
        rightElement={
          <TouchableOpacity
            onPress={() => {
              setEditingId(null);
              setFormData({ name: "", price: "", stock: "", category: "" });
              setShowAddForm(!showAddForm);
            }}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        }
      />

      {showAddForm && (
        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>
            {editingId ? "उत्पाद संपादित करें" : "नया उत्पाद जोड़ें"}
          </Text>

          <TextInput
            label={LABELS_HI.productName}
            placeholder="उत्पाद का नाम"
            value={formData.name}
            onChangeText={(name) => setFormData({ ...formData, name })}
          />

          <TextInput
            label={LABELS_HI.price}
            placeholder="कीमत"
            value={formData.price}
            onChangeText={(price) => setFormData({ ...formData, price })}
            keyboardType="decimal-pad"
          />

          <TextInput
            label={LABELS_HI.stock}
            placeholder="स्टॉक मात्रा"
            value={formData.stock}
            onChangeText={(stock) => setFormData({ ...formData, stock })}
            keyboardType="numeric"
          />

          <TextInput
            label={LABELS_HI.category}
            placeholder="श्रेणी (वैकल्पिक)"
            value={formData.category}
            onChangeText={(category) => setFormData({ ...formData, category })}
          />

          <View style={styles.formButtons}>
            <Button
              title={LABELS_HI.save}
              onPress={handleAddProduct}
              style={{ flex: 1, marginRight: SIZES.md }}
            />
            <Button
              title={LABELS_HI.cancel}
              onPress={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({ name: "", price: "", stock: "", category: "" });
              }}
              variant="outline"
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      )}

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="📦"
            title="कोई उत्पाद नहीं"
            subtitle="अपने इन्वेंटरी को प्रबंधित करने के लिए पहला उत्पाद जोड़ें"
            action={{
              label: "नया उत्पाद जोड़ें",
              onPress: () => {
                setEditingId(null);
                setFormData({ name: "", price: "", stock: "", category: "" });
                setShowAddForm(true);
              },
            }}
          />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card variant="elevated" animated style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productInfo}>
                  <View style={styles.productNameRow}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <StatusBadge
                      status={getStockStatus(item.stock) as any}
                      label={getStockLabel(item.stock)}
                    />
                  </View>
                  {item.category && (
                    <Text style={styles.productCategory}>{item.category}</Text>
                  )}
                </View>
              </View>

              <View style={styles.productDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>कीमत</Text>
                  <Text style={styles.detailValue}>
                    ₹{item.price.toLocaleString('hi-IN')}
                  </Text>
                </View>
              </View>

              <StockIndicator stock={item.stock} lowStockThreshold={BUSINESS.defaultLowStockThreshold} />

              <View style={styles.productActions}>
                <Button
                  title="संपादित करें"
                  onPress={() => handleEditProduct(item)}
                  variant="secondary"
                  size="small"
                  style={{ flex: 1, marginRight: SIZES.md }}
                />
                <Button
                  title="हटाएँ"
                  onPress={() => handleDeleteProduct(item.id)}
                  variant="danger"
                  size="small"
                  style={{ flex: 1 }}
                />
              </View>
            </Card>
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
  productCard: {
    marginBottom: SIZES.md,
  },
  productHeader: {
    marginBottom: SIZES.md,
  },
  productInfo: {
    flex: 1,
  },
  productNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.sm,
  },
  productName: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "600",
    color: COLORS.text || COLORS.textPrimary,
    flex: 1,
  },
  productCategory: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    marginTop: SIZES.xs,
  },
  productDetails: {
    marginBottom: SIZES.md,
    paddingBottom: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || COLORS.gray200,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: SIZES.xs,
  },
  productActions: {
    flexDirection: "row",
    marginTop: SIZES.md,
    gap: SIZES.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
