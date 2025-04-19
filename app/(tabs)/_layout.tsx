import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { Gauge, History, Settings, Leaf } from "lucide-react-native";
import { Theme } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Theme.colors.background,
          borderTopColor: Theme.colors.border,
          height: Platform.OS === "ios" ? 90 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
        },
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: "Inter-Regular",
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: Theme.colors.background,
        },
        headerTitleStyle: {
          fontFamily: "Inter-SemiBold",
          fontSize: 18,
          color: Theme.colors.text,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Gauge color={color} size={size} />,
          headerTitle: "LongLife Tracker",
          headerTitleAlign: "center",
          headerLeft: () => (
            <Leaf
              color={Theme.colors.primary}
              size={24}
              style={{ marginLeft: 16 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} />
          ),
          headerTitle: "Ride History",
          headerTitleAlign: "center",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
          headerTitle: "Settings",
          headerTitleAlign: "center",
        }}
      />
    </Tabs>
  );
}
