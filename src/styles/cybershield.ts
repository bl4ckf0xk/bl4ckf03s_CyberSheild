import { StyleSheet } from 'react-native';

export const cyberColors = {
  primary: '#000000',              // Black accents
  primaryForeground: '#ffffff',    // White text on black buttons
  secondary: '#f5f5f5',            // Light gray for secondary backgrounds
  secondaryForeground: '#000000',  // Black text on light gray
  background: '#ffffff',           // Main background white
  foreground: '#000000',           // Main text black
  muted: '#f9f9f9',                // Very light gray
  mutedForeground: '#555555',      // Medium gray for muted text
  border: '#dcdcdc',               // Light gray border
  input: '#ffffff',                // White input background
  destructive: '#cc0000',          // Red for destructive actions
  destructiveForeground: '#ffffff',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#cc0000',
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
    borderWidth: 1,
    borderColor: cyberColors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
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
    color: cyberColors.foreground,
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
    backgroundColor: cyberColors.secondary,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: cyberColors.secondaryForeground,
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
