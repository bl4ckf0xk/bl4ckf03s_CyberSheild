import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Modal,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface LoadingProps {
  visible: boolean;
  text?: string;
  overlay?: boolean;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Loading: React.FC<LoadingProps> = ({
  visible,
  text = 'Loading...',
  overlay = true,
  size = 'large',
  color = '#007AFF',
  style,
  textStyle,
}) => {
  if (!visible) return null;

  const content = (
    <View style={[styles.container, !overlay && styles.inline, style]}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color} />
        {text && (
          <Text style={[styles.text, textStyle]}>{text}</Text>
        )}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        {content}
      </Modal>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  inline: {
    backgroundColor: 'transparent',
    padding: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#1C1C1E',
    textAlign: 'center',
  },
});

export default Loading;
