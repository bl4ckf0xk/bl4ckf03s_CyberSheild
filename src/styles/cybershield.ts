import { StyleSheet } from 'react-native';

export const cyberColors = {
  primary: '#2563eb',
  primaryForeground: '#ffffff',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  background: '#ffffff',
  foreground: '#0f172a',
  muted: '#f8fafc',
  mutedForeground: '#64748b',
  border: '#e2e8f0',
  input: '#ffffff',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
};

export const cyberStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cyberColors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: cyberColors.background,
    padding: 20,
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    backgroundColor: cyberColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: cyberColors.primaryForeground,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: cyberColors.border,
  },
  buttonOutlineText: {
    color: cyberColors.foreground,
  },
  input: {
    backgroundColor: cyberColors.input,
    borderWidth: 1,
    borderColor: cyberColors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cyberColors.foreground,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: cyberColors.mutedForeground,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: cyberColors.foreground,
  },
  textSmall: {
    fontSize: 14,
    color: cyberColors.mutedForeground,
  },
  textMuted: {
    color: cyberColors.mutedForeground,
  },
  header: {
    backgroundColor: cyberColors.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: cyberColors.primaryForeground,
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  headerSubtitle: {
    color: cyberColors.primaryForeground,
    fontSize: 14,
    opacity: 0.9,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  mb4: {
    marginBottom: 16,
  },
  mb2: {
    marginBottom: 8,
  },
  mt4: {
    marginTop: 16,
  },
  px4: {
    paddingHorizontal: 16,
  },
  py4: {
    paddingVertical: 16,
  },
});
