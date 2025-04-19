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
    };

    if (this.notificationId) {
      await Notifications.dismissNotificationAsync(this.notificationId);
    }

    const notification = await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null, // Immediate notification
    });

    this.notificationId = notification;
  }

  async clearRideNotification() {
    if (Platform.OS === "web" || !this.notificationId) return;

    await Notifications.dismissNotificationAsync(this.notificationId);
    this.notificationId = null;
  }
}
