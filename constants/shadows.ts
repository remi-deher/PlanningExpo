import { Platform, StyleSheet } from 'react-native';

/**
 * Cross-platform shadow utility.
 * - iOS/Android: uses native shadow props
 * - Web: uses CSS boxShadow
 */
export const shadows = {
  small: Platform.select({
    web: { boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 1,
    },
  }),
  medium: Platform.select({
    web: { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
  }),
  large: Platform.select({
    web: { boxShadow: '0 4px 16px rgba(0,0,0,0.12)' },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 4,
    },
  }),
} as const;

/** Common card style reused across screens */
export const cardStyle = StyleSheet.create({
  base: {
    backgroundColor: '#fff',
    borderRadius: 16,
    ...shadows.medium,
  },
}).base;
