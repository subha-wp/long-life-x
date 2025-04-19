export const Theme = {
  colors: {
    primary: "#22C55E", // Vibrant green for primary actions
    secondary: "#059669", // Darker green for secondary elements
    accent: "#10B981", // Emerald green for accents
    success: "#34D399", // Light green for success states
    warning: "#F59E0B", // Amber for warnings
    error: "#EF4444", // Red for errors
    background: "#F8FAF9", // Slightly green-tinted white
    backgroundSecondary: "#ECFDF5", // Light mint green
    text: "#064E3B", // Dark green for text
    textSecondary: "#047857", // Medium green for secondary text
    border: "#D1FAE5", // Light green border
    card: "#FFFFFF", // Pure white for cards
    overlay: "rgba(6, 78, 59, 0.5)", // Semi-transparent dark green
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  shadow: {
    sm: {
      shadowColor: "#064E3B",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#064E3B",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: "#064E3B",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};
