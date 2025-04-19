import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Play, Pause, Square } from "lucide-react-native";
import { Theme } from "@/constants/Colors";

interface TrackingControlsProps {
  isTracking: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

const TrackingControls = ({
  isTracking,
  isPaused,
  onStart,
  onPause,
  onResume,
  onStop,
}: TrackingControlsProps) => {
  if (!isTracking) {
    return (
      <TouchableOpacity style={styles.startButton} onPress={onStart}>
        <Play color="#fff" size={28} />
        <Text style={styles.startButtonText}>Start Ride</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity style={styles.stopButton} onPress={onStop}>
        <Square color="#fff" size={24} fill="#fff" />
      </TouchableOpacity>

      {isPaused ? (
        <TouchableOpacity style={styles.resumeButton} onPress={onResume}>
          <Play color="#fff" size={28} />
          <Text style={styles.resumeButtonText}>Resume</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Pause color="#fff" size={28} />
          <Text style={styles.pauseButtonText}>Pause</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: Theme.spacing.md,
  },
  startButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.round,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    ...Theme.shadow.md,
  },
  startButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#fff",
    marginLeft: Theme.spacing.sm,
  },
  stopButton: {
    backgroundColor: Theme.colors.error,
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.round,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Theme.spacing.md,
    ...Theme.shadow.md,
  },
  pauseButton: {
    backgroundColor: Theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.round,
    flex: 1,
    ...Theme.shadow.md,
  },
  pauseButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#fff",
    marginLeft: Theme.spacing.sm,
  },
  resumeButton: {
    backgroundColor: Theme.colors.success,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
    borderRadius: Theme.borderRadius.round,
    flex: 1,
    ...Theme.shadow.md,
  },
  resumeButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: "#fff",
    marginLeft: Theme.spacing.sm,
  },
});

export default TrackingControls;
