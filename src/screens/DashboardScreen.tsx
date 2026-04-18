import { Button, Card, CurrencyDisplay, Header, Loading } from "@components";
import { COLORS, LABELS_HI, SIZES } from "@constants";
import * as db from "@database/queries";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DashboardStats {
  todaySales: number;
  totalUdhaar: number;
  lowStockCount: number;
  totalCustomers: number;
}

export const DashboardScreen: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    totalUdhaar: 0,
    lowStockCount: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const stats = await db.getDashboardStats();
      setStats(stats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Header
        title={LABELS_HI.dashboard}
        subtitle={new Date().toLocaleDateString("hi-IN")}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>{LABELS_HI.todaysSales}</Text>
          <CurrencyDisplay amount={stats.todaySales} size="large" />
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>{LABELS_HI.totalCredit}</Text>
          <CurrencyDisplay amount={stats.totalUdhaar} size="large" />
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statRow}>
            <View>
              <Text style={styles.statLabel}>{LABELS_HI.lowStockItems}</Text>
              <Text style={styles.statValue}>{stats.lowStockCount} आइटम</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/inventory")}
              style={styles.viewButton}
            >
              <Text style={styles.viewButtonText}>देखें</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.statCard}>
          <Text style={styles.statLabel}>{LABELS_HI.totalCustomers}</Text>
          <Text style={styles.statValue}>{stats.totalCustomers} ग्राहक</Text>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{LABELS_HI.quickActions}</Text>

          <View style={styles.buttonRow}>
            <Button
              title={LABELS_HI.newBill}
              onPress={() => router.push("/billing")}
              style={styles.actionButton}
            />
            <Button
              title={LABELS_HI.addCustomer}
              onPress={() => router.push("/customers")}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>

          <View style={styles.buttonRow}>
            <Button
              title={LABELS_HI.addCredit}
              onPress={() => router.push("/customers")}
              variant="success"
              style={styles.actionButton}
            />
            <Button
              title={LABELS_HI.addProduct}
              onPress={() => router.push("/inventory")}
              variant="outline"
              style={styles.actionButton}
            />
          </View>
        </View>
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
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
  },
  statLabel: {
    fontSize: SIZES.fontSizeSm,
    color: COLORS.textSecondary,
    marginBottom: SIZES.sm,
  },
  statValue: {
    fontSize: SIZES.fontSizeXl,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: SIZES.sm,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewButton: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: SIZES.borderRadiusMd,
  },
  viewButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: SIZES.fontSizeSm,
  },
  section: {
    marginTop: SIZES.lg,
  },
  sectionTitle: {
    fontSize: SIZES.fontSizeLg,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  buttonRow: {
    flexDirection: "row",
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  actionButton: {
    flex: 1,
  },
});
