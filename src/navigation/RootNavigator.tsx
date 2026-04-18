import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import {
  DashboardScreen,
  BillingScreen,
  CustomersScreen,
  CustomerDetailScreen,
  InventoryScreen,
  SettingsScreen,
} from '@screens';
import { COLORS, SIZES } from '@constants';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Icons (using text for simplicity, can be replaced with icons)
const TabIcon: React.FC<{ label: string; focused: boolean }> = ({ label, focused }) => (
  <View style={styles.tabIcon}>
    <Text style={[styles.tabIconText, { color: focused ? COLORS.primary : COLORS.gray500 }]}>
      {label}
    </Text>
  </View>
);

const DashboardStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

const BillingStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BillingHome" component={BillingScreen} />
    </Stack.Navigator>
  );
};

const CustomersStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CustomersList" component={CustomersScreen} />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
      />
    </Stack.Navigator>
  );
};

const InventoryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InventoryHome" component={InventoryScreen} />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsHome" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray500,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: () => {
          let label = '';
          switch (route.name) {
            case 'Dashboard':
              label = '📊';
              break;
            case 'Billing':
              label = '🧾';
              break;
            case 'Customers':
              label = '👥';
              break;
            case 'Inventory':
              label = '📦';
              break;
            case 'Settings':
              label = '⚙️';
              break;
          }
          return <Text style={styles.tabEmoji}>{label}</Text>;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardStack}
        options={{ title: 'डैशबोर्ड' }}
      />
      <Tab.Screen
        name="Billing"
        component={BillingStack}
        options={{ title: 'बिलिंग' }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomersStack}
        options={{ title: 'ग्राहक' }}
      />
      <Tab.Screen
        name="Inventory"
        component={InventoryStack}
        options={{ title: 'इन्वेंटरी' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ title: 'सेटिंग्स' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    paddingTop: SIZES.sm,
    paddingBottom: SIZES.md,
    height: 60,
  },
  tabBarLabel: {
    fontSize: SIZES.fontSizeSm,
    marginTop: SIZES.xs,
    fontWeight: '600',
  },
  tabIcon: {
    alignItems: 'center',
  },
  tabIconText: {
    fontSize: SIZES.fontSizeLg,
  },
  tabEmoji: {
    fontSize: 24,
  },
});
