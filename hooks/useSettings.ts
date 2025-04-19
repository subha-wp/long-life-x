import { create } from 'zustand';
import { Settings, defaultSettings } from '@/types/settings';
import { SettingsService } from '@/services/SettingsService';

interface SettingsState {
  settings: Settings;
  isLoading: boolean;
  
  initSettings: () => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettings = create<SettingsState>((set, get) => ({
  settings: defaultSettings,
  isLoading: true,
  
  initSettings: async () => {
    set({ isLoading: true });
    try {
      const settingsService = new SettingsService();
      const settings = await settingsService.getSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize settings:', error);
      set({ settings: defaultSettings, isLoading: false });
    }
  },
  
  updateSettings: async (newSettings: Partial<Settings>) => {
    set({ isLoading: true });
    try {
      const settingsService = new SettingsService();
      const updatedSettings = await settingsService.saveSettings(newSettings);
      set({ settings: updatedSettings, isLoading: false });
    } catch (error) {
      console.error('Failed to update settings:', error);
      set({ isLoading: false });
    }
  },
  
  resetSettings: async () => {
    set({ isLoading: true });
    try {
      const settingsService = new SettingsService();
      const defaultSettings = await settingsService.resetSettings();
      set({ settings: defaultSettings, isLoading: false });
    } catch (error) {
      console.error('Failed to reset settings:', error);
      set({ isLoading: false });
    }
  },
}));

// Initialize settings
useSettings.getState().initSettings();