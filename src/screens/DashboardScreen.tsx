import { Button, Card, CurrencyDisplay, Header, Loading, StatCard, ActionCard, Badge } from "@components";
import { COLORS, LABELS_HI, SIZES, SHADOWS } from "@constants";
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
import { useTranslation } from "react-i18next";

interface DashboardStats {
  todaySales: number;
  totalUdhaar: number;
  lowStockCount: number;
  totalCustomers: number;
}

export const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
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
        title={t("dashboard.title")}
        subtitle={new Date().toLocaleDateString()}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Card */}
        <Card variant="elevated" style={styles.greetingCard} animated>
          <View style={styles.greetingContent}>
            <Text style={styles.greetingEmoji}>🙏</Text>
            <View style={styles.greetingText}>
              <Text style={styles.greeting}>{t("dashboard.welcome")}</Text>
              <Text style={styles.greetingSubtitle}>{t("dashboard.total_balance")}</Text>
            </View>
          </View>
        </Card>

        {/* Stats Grid - Premium Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="💰"
            label={t("dashboard.given")}
            value={`₹${stats.todaySales.toLocaleString()}`}
            color={COLORS.primary}
            style={styles.statCardSmall}
            animateValue
          />
          <StatCard
            icon="📊"
            label={t("dashboard.taken")}
            value={`₹${stats.totalUdhaar.toLocaleString()}`}
            color={COLORS.secondary}
            style={styles.statCardSmall}
            animateValue
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="📦"
            label={t("dashboard.settled")}
            value={`${stats.lowStockCount}`}
            color={COLORS.warning}
            style={styles.statCardSmall}
            animateValue
          />
          <StatCard
            icon="👥"
            label={t("dashboard.pending")}
            value={`${stats.totalCustomers}`}
            color={COLORS.secondary}
            style={styles.statCardSmall}
            animateValue
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("dashboard.add_transaction")}</Text>

          <View style={styles.actionGrid}>
            <ActionCard
              icon="📝"
              label={t("transactions.add_new")}
              backgroundColor={COLORS.primary}
              onPress={() => router.push("/billing")}
            />
            <ActionCard
              icon="➕"
              label={t("contacts.add_new")}
              backgroundColor={COLORS.secondary}
              onPress={() => router.push("/customers")}
            />
          </View>

          <View style={styles.actionGrid}>
            <ActionCard
              icon="💳"
              label={t("dashboard.add_transaction")}
              backgroundColor="#F59E0B"
              onPress={() => router.push("/customers")}
            />
            <ActionCard
              icon="📦"
              label={t("dashboard.add_transaction")}
              backgroundColor={COLORS.primary}
              onPress={() => router.push("/inventory")}
            />
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{t("reports.summary")}</Text>
              {stats.todaySales > 0 && (
                <Badge
                  label={`${t("dashboard.given")}: ₹${stats.todaySales}`}
                  variant="success"
                  style={styles.infoBadge}
                />
              )}
              {stats.totalUdhaar > 0 && (
                <Badge
                  label={`${t("dashboard.taken")}: ₹${stats.totalUdhaar}`}
                  variant="warning"
                  style={styles.infoBadge}
                />
              )}
            </View>
          </Card>
        </View>
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
  greetingCard: {
    backgroundColor: COLORS.primary,
    marginBottom: SIZES.lg,
  },
  greetingContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingEmoji: {
    fontSize: 48,
    marginRight: SIZES.lg,
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: SIZES.fontSizeXl,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: SIZES.xs,
  },
  greetingSubtitle: {
    fontSize: SIZES.fontSizeMd,
    color: "rgba(255, 255, 255, 0.85)",
  },
  statsGrid: {
    flexDirection: "row",
    gap: SIZES.md,
    marginBottom: SIZES.md,
  },
  statCardSmall: {
    flex: 1,
    marginBottom: 0,
  },
  section: {
    marginTop: SIZES.xl,
    marginBottom: SIZES.lg,
  },
  sectionTitle: {
    fontSize: SIZES.fontSizeLg,
    fontWeight: "700",
    color: COLORS.text || COLORS.textPrimary,
    marginBottom: SIZES.lg,
  },
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: SIZES.md,
  },
  infoSection: {
    marginBottom: SIZES.xl,
  },
  infoCard: {
    backgroundColor: COLORS.surface || COLORS.white,
  },
  infoContent: {
    gap: SIZES.sm,
  },
  infoTitle: {
    fontSize: SIZES.fontSizeMd,
    fontWeight: "700",
    color: COLORS.text || COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  infoBadge: {
    marginBottom: SIZES.xs,
  },
});
