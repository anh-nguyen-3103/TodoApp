// src/utils/haptic.ts

import { trigger } from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

// Define the haptic feedback types
export const HapticFeedbackTypes = {
  impactLight: 'impactLight',
  impactMedium: 'impactMedium',
  impactHeavy: 'impactHeavy',
  rigid: 'rigid',
  soft: 'soft',
  notificationSuccess: 'notificationSuccess',
  notificationWarning: 'notificationWarning',
  notificationError: 'notificationError',
  selection: 'selection',
} as const;

// Create a type from the object values
export type HapticType = (typeof HapticFeedbackTypes)[keyof typeof HapticFeedbackTypes];

// Interface for haptic options
export interface HapticOptions {
  enableVibrateFallback: boolean;
  ignoreAndroidSystemSettings: boolean;
}

// Default configuration
const defaultOptions: HapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Interface for predefined patterns
interface HapticPatterns {
  success: () => void;
  warning: () => void;
  error: () => void;
  light: () => void;
  medium: () => void;
  heavy: () => void;
  selection: () => void;
}

class HapticFeedback {
  private static isEnabled: boolean = true;

  /**
   * Trigger haptic feedback
   * @param type - Type of haptic feedback
   * @param customOptions - Optional custom configuration
   */
  static trigger(type: HapticType, customOptions: Partial<HapticOptions> = {}): void {
    if (!this.isEnabled) {
      return;
    }

    const options: HapticOptions = {
      ...defaultOptions,
      ...customOptions,
    };

    if (Platform.OS === 'ios' || options.enableVibrateFallback) {
      trigger(type, options);
    }
  }

  /**
   * Enable haptic feedback
   */
  static enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable haptic feedback
   */
  static disable(): void {
    this.isEnabled = false;
  }

  /**
   * Check if haptic feedback is enabled
   */
  static isHapticEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Common haptic patterns
   */
  static patterns: HapticPatterns = {
    success: (): void => this.trigger(HapticFeedbackTypes.notificationSuccess),
    warning: (): void => this.trigger(HapticFeedbackTypes.notificationWarning),
    error: (): void => this.trigger(HapticFeedbackTypes.notificationError),
    light: (): void => this.trigger(HapticFeedbackTypes.impactLight),
    medium: (): void => this.trigger(HapticFeedbackTypes.impactMedium),
    heavy: (): void => this.trigger(HapticFeedbackTypes.impactHeavy),
    selection: (): void => this.trigger(HapticFeedbackTypes.selection),
  };
}

export default HapticFeedback;