import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsService } from "@/services/SettingsService";
import { useSettings } from "@/hooks/useSettings";
import { Settings as SettingsType } from "@/types/settings";
import {
  Moon,
  Sun,
  Zap,
  Share2,
  Trash2,
  Info,
  Github,
} from "lucide-react-native";
import { Theme } from "@/constants/Colors";

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();

  const handleToggle = (key: keyof SettingsType, value: boolean) => {
    updateSettings({ [key]: value });
  };

  const handleResetSettings = () => {
    Alert.alert(
      "Reset Settings",
      "Are you sure you want to reset all settings to default?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => resetSettings(),
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all ride history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              const settingsService = new SettingsService();
              await settingsService.clearRideHistory();
              Alert.alert("Success", "Ride history has been cleared.");
            } catch (error) {
              console.error("Failed to clear ride history:", error);
              Alert.alert("Error", "Failed to clear ride history.");
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    description: string,
    control: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingControl}>{control}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tracking Settings</Text>

          {renderSettingItem(
            <Zap color={Theme.colors.primary} size={22} />,
            "Auto-Pause",
            "Automatically pause tracking when stopped",
            <Switch
              trackColor={{ false: "#e0e0e0", true: Theme.colors.primary }}
              thumbColor="#fff"
              ios_backgroundColor="#e0e0e0"
              onValueChange={(value) => handleToggle("autoPause", value)}
              value={settings.autoPause}
            />
          )}

          {Platform.OS !== "web" &&
            renderSettingItem(
              <Moon color={Theme.colors.primary} size={22} />,
              "Background Tracking",
              "Continue tracking when app is in background",
              <Switch
                trackColor={{ false: "#e0e0e0", true: Theme.colors.primary }}
                thumbColor="#fff"
                ios_backgroundColor="#e0e0e0"
                onValueChange={(value) =>
                  handleToggle("backgroundTracking", value)
                }
                value={settings.backgroundTracking}
              />
            )}

          {renderSettingItem(
            <Share2 color={Theme.colors.primary} size={22} />,
            "Auto-Share Rides",
            "Show share option after completing rides",
            <Switch
              trackColor={{ false: "#e0e0e0", true: Theme.colors.primary }}
              thumbColor="#fff"
              ios_backgroundColor="#e0e0e0"
              onValueChange={(value) => handleToggle("autoShareRides", value)}
              value={settings.autoShareRides}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display Settings</Text>

          {renderSettingItem(
            <Sun color={Theme.colors.primary} size={22} />,
            "Use Metric System",
            "Display distance in kilometers instead of miles",
            <Switch
              trackColor={{ false: "#e0e0e0", true: Theme.colors.primary }}
              thumbColor="#fff"
              ios_backgroundColor="#e0e0e0"
              onValueChange={(value) => handleToggle("useMetricSystem", value)}
              value={settings.useMetricSystem}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearHistory}
          >
            <Trash2 color={Theme.colors.error} size={22} />
            <Text style={styles.dangerButtonText}>Clear Ride History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleResetSettings}
          >
            <Trash2 color={Theme.colors.error} size={22} />
            <Text style={styles.dangerButtonText}>
              Reset to Default Settings
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.aboutItem}>
            <Info color={Theme.colors.primary} size={22} />
            <Text style={styles.aboutItemText}>Version 1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.aboutItem}>
            <Github color={Theme.colors.primary} size={22} />
            <Text style={styles.aboutItemText}>GitHub Repository</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  section: {
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadow.sm,
  },
  sectionTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  settingIcon: {
    marginRight: Theme.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: Theme.colors.text,
  },
  settingDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Theme.colors.textSecondary,
    marginTop: 2,
  },
  settingControl: {
    marginLeft: Theme.spacing.md,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  dangerButtonText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Theme.colors.error,
    marginLeft: Theme.spacing.md,
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.border,
  },
  aboutItemText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Theme.colors.text,
    marginLeft: Theme.spacing.md,
  },
});
