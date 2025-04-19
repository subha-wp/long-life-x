import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Play, Pause, Square } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Location from "expo-location";
import { formatDistance, formatDuration } from "@/utils/formatter";
import { useTrackingStore } from "@/stores/trackingStore";
import { LocationService } from "@/services/LocationService";
import { RideDetectionService } from "@/services/RideDetectionService";
import RideSummaryCard from "@/components/RideSummaryCard";
import TrackingControls from "@/components/TrackingControls";
import DailyStatsCard from "@/components/DailyStatsCard";
import { Theme } from "@/constants/Colors";

export default function Dashboard() {
  const {
    isTracking,
    isPaused,
    currentDistance,
    currentDuration,
    todayDistance,
    todayRidesCount,
    startTracking,
    pauseTracking,
    resumeTracking,
    stopTracking,
    loadTodayStats,
  } = useTrackingStore();

  const locationService = useRef(new LocationService()).current;
  const rideDetectionService = useRef(new RideDetectionService()).current;
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null
  );

  // Animation values
  const animatedScale = useSharedValue(1);
  const animatedOpacity = useSharedValue(1);

  useEffect(() => {
    requestLocationPermission();
    // Load today's stats when component mounts
    loadTodayStats();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");

      if (status !== "granted") {
        if (Platform.OS === "web") {
          Alert.alert(
            "Permission Required",
            "Location permission is required to track your rides. Please enable location services in your browser."
          );
        } else {
          Alert.alert(
            "Permission Required",
            "Location permission is required to track your rides."
          );
        }
      }
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setLocationPermission(false);
    }
  };

  const handleStartTracking = async () => {
    if (!locationPermission) {
      await requestLocationPermission();
      if (!locationPermission) return;
    }

    animatedScale.value = withSpring(1.1, { damping: 10 });
    setTimeout(() => {
      animatedScale.value = withSpring(1);
    }, 200);

    try {
      await locationService.startLocationTracking();
      await rideDetectionService.startRideDetection();
      startTracking();
    } catch (error) {
      console.error("Failed to start tracking:", error);
      Alert.alert("Error", "Failed to start tracking. Please try again.");
    }
  };

  const handlePauseTracking = async () => {
    animatedOpacity.value = withSpring(0.7);
    setTimeout(() => {
      animatedOpacity.value = withSpring(1);
    }, 200);

    try {
      await locationService.pauseLocationTracking();
      pauseTracking();
    } catch (error) {
      console.error("Failed to pause tracking:", error);
      Alert.alert("Error", "Failed to pause tracking. Please try again.");
    }
  };

  const handleResumeTracking = async () => {
    animatedScale.value = withSpring(1.1, { damping: 10 });
    setTimeout(() => {
      animatedScale.value = withSpring(1);
    }, 200);

    try {
      await locationService.resumeLocationTracking();
      resumeTracking();
    } catch (error) {
      console.error("Failed to resume tracking:", error);
      Alert.alert("Error", "Failed to resume tracking. Please try again.");
    }
  };

  const handleStopTracking = async () => {
    try {
      await locationService.stopLocationTracking();
      await rideDetectionService.stopRideDetection();
      stopTracking();
      // Reload today's stats after stopping
      loadTodayStats();
    } catch (error) {
      console.error("Failed to stop tracking:", error);
      Alert.alert("Error", "Failed to stop tracking. Please try again.");
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedScale.value }],
      opacity: animatedOpacity.value,
    };
  });

  if (locationPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isTracking ? (
          <View style={styles.trackingContainer}>
            <Animated.View style={[styles.statsContainer, animatedStyle]}>
              <Text style={styles.distanceValue}>
                {formatDistance(currentDistance)}
              </Text>
              <Text style={styles.distanceLabel}>Distance</Text>
              <Text style={styles.durationValue}>
                {formatDuration(currentDuration)}
              </Text>
              <Text style={styles.durationLabel}>Duration</Text>
            </Animated.View>

            <TrackingControls
              isTracking={isTracking}
              isPaused={isPaused}
              onStart={handleStartTracking}
              onPause={handlePauseTracking}
              onResume={handleResumeTracking}
              onStop={handleStopTracking}
            />
          </View>
        ) : (
          <View style={styles.notTrackingContainer}>
            <RideSummaryCard />
            <DailyStatsCard
              todayDistance={todayDistance}
              ridesCount={todayRidesCount}
              loyaltyPoints={todayRidesCount * 10}
            />

            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStartTracking}
              disabled={!locationPermission}
            >
              <Play color="#fff" size={28} />
              <Text style={styles.startButtonText}>Start Ride</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Theme.colors.textSecondary,
  },
  trackingContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Theme.spacing.xxl,
  },
  statsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  distanceValue: {
    fontFamily: "Inter-Bold",
    fontSize: 56,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  distanceLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.lg,
  },
  durationValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 36,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.xs,
  },
  durationLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: Theme.colors.textSecondary,
  },
  notTrackingContainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: Theme.spacing.lg,
  },
  startButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.round,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    alignSelf: "center",
    marginTop: Theme.spacing.xl,
    ...Theme.shadow.md,
  },
  startButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#fff",
    marginLeft: Theme.spacing.sm,
  },
});
