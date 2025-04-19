import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings, defaultSettings } from '@/types/settings';
import { RideHistoryService } from './RideHistoryService';

export class SettingsService {
  private readonly SETTINGS_STORAGE_KEY = 'bike_tracker_settings';

  constructor() {}

  async getSettings(): Promise<Settings> {
    try {
      const settingsJson = await AsyncStorage.getItem(this.SETTINGS_STORAGE_KEY);
      if (!settingsJson) return defaultSettings;

      return { ...defaultSettings, ...JSON.parse(settingsJson) };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: Partial<Settings>): Promise<Settings> {
    try {
      const currentSettings = await this.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      
      await AsyncStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  async resetSettings(): Promise<Settings> {
    try {
      await AsyncStorage.setItem(this.SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
      return defaultSettings;
    } catch (error) {
      console.error('Failed to reset settings:', error);
      throw error;
    }
  }

  async clearRideHistory(): Promise<void> {
    try {
      const rideHistoryService = new RideHistoryService();
      await rideHistoryService.clearAllRides();
    } catch (error) {
      console.error('Failed to clear ride history:', error);
      throw error;
    }
  }
}