// @ts-nocheck
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export class NotificationService {
  private static instance: NotificationService;
  private notificationId: string | null = null;

  private constructor() {
    this.configureNotifications();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async configureNotifications() {
    if (Platform.OS === "web") return;

    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowAlert: false, // Don't show alert for updates
        shouldShowAlert: true, // But show for initial notification
      }),
    });

    // Configure notification categories/actions
    await Notifications.setNotificationCategoryAsync("RIDE_TRACKING", [
      {
        identifier: "PAUSE_RIDE",
        buttonTitle: "Pause",
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: "STOP_RIDE",
        buttonTitle: "Stop",
        options: {
          isDestructive: true,
          isAuthenticationRequired: false,
        },
      },
    ]);
  }

  async updateRideNotification(distance: string, duration: string) {
    if (Platform.OS === "web") return;

    const notificationContent = {
      title: "Ride in Progress",
      body: `Distance: ${distance}\nDuration: ${duration}`,
      data: { type: "RIDE_TRACKING" },
      categoryIdentifier: "RIDE_TRACKING",
      sticky: true, // Keep the notification visible
      android: {
        channelId: "ride-tracking",
        ongoing: true, // Makes it persistent on Android
        autoCancel: false,
        foregroundServiceType: ["location"],
      },
      ios: {
        sound: false,
      },
    };

    try {
      // For the first notification
      if (!this.notificationId) {
        // Create the notification channel for Android
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("ride-tracking", {
            name: "Ride Tracking",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#22C55E",
          });
        }

        const notification = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: null, // Immediate notification
        });

        this.notificationId = notification;
      } else {
        // Update existing notification
        await Notifications.scheduleNotificationAsync({
          identifier: this.notificationId,
          content: notificationContent,
          trigger: null,
        });
      }
    } catch (error) {
      console.error("Failed to update notification:", error);
    }
  }

  async clearRideNotification() {
    if (Platform.OS === "web" || !this.notificationId) return;

    try {
      await Notifications.dismissNotificationAsync(this.notificationId);
      this.notificationId = null;
    } catch (error) {
      console.error("Failed to clear notification:", error);
    }
  }
}
