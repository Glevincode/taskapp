import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNotification } from './NotificationContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTheme } from './ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const BellNotification = () => {
  const { notifications, deleteNotification } = useNotification();
  const { darkMode } = useTheme();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const bgColor = darkMode ? '#0f172a' : '#F5F7FA';
  const cardColor = darkMode ? '#1f2937' : '#fff';
  const textColor = darkMode ? '#fff' : '#333';
  const legendColor = darkMode ? '#fff' : '#333';

  const iconSize = width * 0.07 + 10;        // Bell icon
  const smallIconSize = width * 0.05;        // Small icon
  const titleFontSize = width * 0.05;        // Title font size
  const notifFontSize = width * 0.035;       // Notification text

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      
      {/* Header */}
      <View style={[styles.headerWrapper, { backgroundColor: cardColor, paddingHorizontal: width * 0.05, paddingVertical: width * 0.04 }]}>
        <TouchableOpacity onPress={handleBackPress} style={{ padding: 5 }}>
          <MaterialIcons name="keyboard-arrow-left" size={iconSize} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor, fontSize: titleFontSize }]}>Notification</Text>
      </View>

      {/* Notifications List */}
      <SwipeListView
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: width * 0.04, paddingBottom: width * 0.1 }}
        renderItem={({ item }) => (
          <View style={[styles.taskItem, { backgroundColor: cardColor, padding: width * 0.04, borderRadius: 16 }]}>
            <View style={styles.notifItem}>

              {/* Icon Avatar */}
              <View style={{ position: 'relative', width: width * 0.12, height: width * 0.12, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="notifications" size={iconSize} color="#f87171" />
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: smallIconSize,
                  height: smallIconSize,
                  borderRadius: smallIconSize / 2,
                  backgroundColor: bgColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: '#4ade80',
                }}>
                  <Ionicons name={item.icon || 'notifications-outline'} size={smallIconSize * 0.5} color={textColor} />
                </View>
              </View>

              {/* Notification Text */}
              <View style={{ flex: 1, marginLeft: width * 0.03 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
                  {item.message && item.message.includes('"') && item.message.split('"').length === 3 ? (
                    <>
                      <Text style={{ color: textColor, fontSize: notifFontSize }}>{item.message.split('"')[0]}</Text>
                      <Text style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: notifFontSize }}>{item.message.split('"')[1]}</Text>
                      <Text style={{ color: textColor, fontSize: notifFontSize }}>{item.message.split('"')[2]}</Text>
                    </>
                  ) : (
                    <Text style={{ color: textColor, fontSize: notifFontSize }}>
                      {item.message || 'No message available'}
                    </Text>
                  )}
                </View>
              </View>

            </View>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={[styles.hiddenItem, { borderRadius: 16, backgroundColor: '#f87171', paddingRight: width * 0.05, marginTop: 20, }]}>
            <TouchableOpacity onPress={() => deleteNotification(item.id)}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: notifFontSize }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-80}
        disableRightSwipe
      />

      {/* Empty State */}
      {notifications.length === 0 && (
        <Text style={{ color: legendColor, textAlign: 'center', marginTop: width * 0.2, fontSize: notifFontSize }}>
          No notifications yet.
        </Text>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomRightRadius: 35,
  },
  headerTitle: {
    marginLeft: 12,
    fontWeight: 'bold',
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskItem: {
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    marginTop: 20,
  },
  hiddenItem: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 10,
  },
});

export default BellNotification;
