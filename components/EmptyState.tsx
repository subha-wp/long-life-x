import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { History, Settings, MapPin } from "lucide-react-native";
import { Theme } from "@/constants/Colors";

interface EmptyStateProps {
  icon: "history" | "settings" | "location";
  title: string;
  message: string;
}

const EmptyState = ({ icon, title, message }: EmptyStateProps) => {
  const renderIcon = () => {
    switch (icon) {
      case "history":
        return <History size={50} color={Theme.colors.textSecondary} />;
      case "settings":
        return <Settings size={50} color={Theme.colors.textSecondary} />;
      case "location":
        return <MapPin size={50} color={Theme.colors.textSecondary} />;
      default:
        return <History size={50} color={Theme.colors.textSecondary} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{renderIcon()}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Theme.spacing.xl,
  },
  iconContainer: {
    backgroundColor: Theme.colors.backgroundSecondary,
    padding: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.round,
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.sm,
  },
  message: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Theme.colors.textSecondary,
    textAlign: "center",
  },
});

export default EmptyState;
