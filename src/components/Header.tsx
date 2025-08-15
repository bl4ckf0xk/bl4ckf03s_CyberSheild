import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  leftAction?: {
    text: string;
    onPress: () => void;
  };
  rightAction?: {
    text: string;
    onPress: () => void;
  };
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftAction,
  rightAction,
  backgroundColor = '#FFFFFF',
  textColor = '#1C1C1E',
  style,
  titleStyle,
}) => {
  const insets = useSafeAreaInsets();

  const headerStyle = [
    styles.header,
    { backgroundColor, paddingTop: insets.top },
    style,
  ];

  const titleTextStyle = [
    styles.title,
    { color: textColor },
    titleStyle,
  ];

  const actionTextStyle = [
    styles.actionText,
    { color: textColor === '#1C1C1E' ? '#007AFF' : textColor },
  ];

  return (
    <>
      <StatusBar
        barStyle={backgroundColor === '#FFFFFF' ? 'dark-content' : 'light-content'}
        backgroundColor={backgroundColor}
      />
      <View style={headerStyle}>
        <View style={styles.content}>
          <View style={styles.leftContainer}>
            {leftAction && (
              <TouchableOpacity onPress={leftAction.onPress}>
                <Text style={actionTextStyle}>{leftAction.text}</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.centerContainer}>
            <Text style={titleTextStyle} numberOfLines={1}>
              {title}
            </Text>
          </View>
          
          <View style={styles.rightContainer}>
            {rightAction && (
              <TouchableOpacity onPress={rightAction.onPress}>
                <Text style={actionTextStyle}>{rightAction.text}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#D1D1D6',
  },
  content: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Header;
