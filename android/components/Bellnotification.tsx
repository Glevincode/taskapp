import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNotification } from './NotificationContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useTheme } from './ThemeContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const BellNotification = () => {
  const { notifications, deleteNotification } = useNotification();
  const { darkMode } = useTheme();
   const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const bgColor = darkMode ? '#0f172a' : '#F5F7FA';
  const cardColor = darkMode ? '#1f2937' : '#fff';
  const textColor = darkMode ? '#fff' : '#333';
  const legendColor = darkMode ? '#fff' : '#333';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
       
       <View style={[styles.innerTitleWrapper, {backgroundColor: cardColor}]}>
          <TouchableOpacity onPress={handleBackPress}>
              <MaterialIcons style={styles.navIcons} name="keyboard-arrow-left" size={35} color={textColor} />
              </TouchableOpacity>
              <Text style={[styles.notiTittle, {color: textColor}]}>Notification</Text>
              
            </View>
      <SwipeListView
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskitem, { backgroundColor: cardColor }]}>
            <View style={styles.notifItem}>

              {/* Circular Icon Avatar */}
             <View style={styles.iconWrapper}>
                {/* Large Bell Icon */}
                <Ionicons name="notifications" size={30} color="#f87171" />

             
                <View style={[styles.smallIconContainer, {backgroundColor: bgColor}]}>

                  
                  <Ionicons name={item.icon || 'notifications-outline'} size={11} color={textColor} />
                </View>
              </View>

              <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
          {item.message && item.message.includes('"') && item.message.split('"').length === 3 ? (
            <>
              <Text style={[styles.notifText, { color: textColor }]}>
                {item.message.split('"')[0]}
              </Text>
              <Text style={[styles.notifText, { color: '#8b5cf6', fontWeight: 'bold' }]}>
                {item.message.split('"')[1]}
              </Text>
              <Text style={[styles.notifText, { color: textColor }]}>
                {item.message.split('"')[2]}
              </Text>
            </>
          ) : (
            <Text style={[styles.notifText, { color: textColor }]}>
              {item.message || 'No message available'}
            </Text>
          )}
        </View>
              </View>

            </View>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.hiddenItem}>
            <TouchableOpacity onPress={() => deleteNotification(item.id)} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-80}
        disableRightSwipe
      />

      {notifications.length === 0 && (
        <Text style={[styles.empty, { color: legendColor }]}>No notifications yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskitem: {
    borderRadius: 20,
    marginBottom: 7,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowRadius: 5,
    elevation: 2,
    width: 360,
    left: 10,
    top: 10,
    paddingVertical: 3,
  },
  notifText: {
    fontSize: 13,
    fontWeight: 'bold',
    left: 10,
  },
  hiddenItem: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#f87171',
    flex: 1,
    borderRadius: 20,
    marginBottom: 10,
    width: 360,
    left: 10,
    top: 10,
    paddingRight: 20,
  },
  deleteBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
  },

  iconWrapper: {
  position: 'relative',
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
},

smallIconContainer: {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: 20,
  height: 20,
  borderRadius: 12,
  backgroundColor: '#4ade80',   // 💡 Green or any color you like
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#4ade80',
},

innerTitleWrapper: {
  flexDirection: 'row',
  height: 70,
  width: 430,
  right: 28,
  borderBottomRightRadius: 45,
  
},
navIcons: {
  top: 20,
  left: 20,
},
notiTittle: {
  position: 'absolute',
  top: 25,
  left: '37%',
  fontSize: 20,
},



});

export default BellNotification;
