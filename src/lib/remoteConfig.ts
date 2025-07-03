// Firebase Remote Config for dynamic feature flags and ad configuration
import { getRemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';
import app from '@/lib/firebase';

const remoteConfig = getRemoteConfig(app);

// Set default values
remoteConfig.defaultConfig = {
  'enable_ads': true,
  'ad_frequency': 3,
  'feature_ai_chat': true,
  'feature_marketplace': true,
  'max_posts_per_page': 10,
  'enable_notifications': true
};

// Development settings
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour

export const initializeRemoteConfig = async () => {
  try {
    await fetchAndActivate(remoteConfig);
    console.log('Remote config fetched and activated');
    return true;
  } catch (error) {
    console.warn('Remote config fetch failed, using defaults:', error);
    return false;
  }
};

export const getConfigValue = (key: string): boolean | string | number => {
  try {
    const value = getValue(remoteConfig, key);
    return value.asBoolean() || value.asString() || value.asNumber();
  } catch (error) {
    console.warn(`Failed to get config value for ${key}:`, error);
    return remoteConfig.defaultConfig[key] || false;
  }
};

// Specific config getters
export const isAdsEnabled = (): boolean => getConfigValue('enable_ads') as boolean;
export const getAdFrequency = (): number => getConfigValue('ad_frequency') as number;
export const isAIChatEnabled = (): boolean => getConfigValue('feature_ai_chat') as boolean;