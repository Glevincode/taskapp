// firebaseNotifications.js
import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    getFcmToken();
  }
}

async function getFcmToken() {
  const token = await messaging().getToken();
  if (token) {
    console.log('FCM Token:', token);
    // Send this token to your server if needed
  }
}

export function notificationListener() {
  // App in foreground
  messaging().onMessage(async remoteMessage => {
    const title = remoteMessage.notification?.title ?? 'Notification';
    const body = remoteMessage.notification?.body ?? '';
    Alert.alert(title, body);
  });

  // App in background or quit
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in background:', remoteMessage);
  });
}
